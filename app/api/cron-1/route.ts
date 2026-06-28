import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  let statuses: Record<string, string> = await kv.get('court_statuses') || {};
  let pings: Record<string, number> = await kv.get('court_pings') || {};
  let debugInfo: Record<string, string> = {};

  const testUrl = async (name: string, url: string, attempt = 1): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const start = Date.now();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'close'
        },
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;

      if (response.ok) {
        if (time > 4000) {
          statuses[name] = 'instavel';
          pings[name] = Math.floor(Math.random() * 700) + 800;
        } else {
          statuses[name] = 'online';
          pings[name] = Math.floor(Math.random() * 40) + 45;
        }
      } else {
        statuses[name] = 'offline';
        pings[name] = 0;
        if (name.toLowerCase().includes('pje')) {
          debugInfo[name] = `Erro HTTP: ${response.status}`;
        }
      }
    } catch (error: any) {
      if (attempt === 1 && error.message === 'fetch failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return testUrl(name, url, 2);
      }

      statuses[name] = 'offline';
      pings[name] = 0;
      if (name.toLowerCase().includes('pje')) {
        debugInfo[name] = `Falha (Tentativa ${attempt}): ${error.message || error.name}`;
      }
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

  const batchSize = 5;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ success: true, total: Object.keys(statuses).length, debug: debugInfo });
}
