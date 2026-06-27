import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  const statuses: Record<string, string> = {};

  const testUrl = async (name: string, url: string) => {
    try {
      const controller = new AbortController();
      // Aumentamos a paciência do robô para 10 segundos por site
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      const start = Date.now();

      const response = await fetch(url, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        redirect: 'follow', // Obriga o robô a seguir redirecionamentos do governo
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;

      if (response.ok) {
        statuses[name] = time > 4000 ? 'instavel' : 'online';
      } else {
        statuses[name] = 'offline';
      }
    } catch (error) {
      statuses[name] = 'offline';
    }
  };

  const tasks: (() => Promise<void>)[] = [];

  for (const trib of jurisdictions.federais) {
    tasks.push(() => testUrl(trib.name, trib.url));
  }

  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      for (const trib of estados[estado]) {
        tasks.push(() => testUrl(trib.name, trib.url));
      }
    }
  }

  // Lotes minúsculos de 3 em 3, com pausa de meio segundo
  const batchSize = 3;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 500)); 
  }

  await kv.set('court_statuses', statuses);

  return NextResponse.json({ success: true, total: Object.keys(statuses).length });
}
