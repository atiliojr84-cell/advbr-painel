import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  const statuses: Record<string, string> = {};

  const testUrl = async (name: string, url: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); 
      const start = Date.now();

      // Aqui está a mágica: método GET e a "máscara" de navegador
      const response = await fetch(url, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;

      if (response.ok) {
        statuses[name] = time > 3000 ? 'instavel' : 'online';
      } else {
        statuses[name] = 'offline';
      }
    } catch (error) {
      statuses[name] = 'offline';
    }
  };

  const promises = [];

  for (const trib of jurisdictions.federais) {
    promises.push(testUrl(trib.name, trib.url));
  }

  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      for (const trib of estados[estado]) {
        promises.push(testUrl(trib.name, trib.url));
      }
    }
  }

  await Promise.allSettled(promises);
  await kv.set('court_statuses', statuses);

  return NextResponse.json({ success: true, total: Object.keys(statuses).length });
}
