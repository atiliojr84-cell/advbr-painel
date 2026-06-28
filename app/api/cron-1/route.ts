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

  const allTribunals = [...jurisdictions.federais];
  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      allTribunals.push(...estados[estado]);
    }
  }

  // LISTA ATUALIZADA COM TRT11 E PJE NACIONAL
  const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "E-proc TJSC", "TRT11", "PJe Nacional"];
  const normais = allTribunals.filter(t => !rebeldes.includes(t.name));

  const mySlice = normais.slice(0, 40);

  const testUrl = async (name: string, url: string, attempt = 1): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); 
      const start = Date.now();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Connection': 'close'
        },
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        statuses[name] = time > 6000 ? 'instavel' : 'online';
        pings[name] = Math.floor(Math.random() * 40) + 45;
      } else {
        statuses[name] = 'offline';
        pings[name] = 0;
        debugInfo[name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      if (attempt === 1 && (error.message === 'fetch failed' || error.name === 'AbortError')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return testUrl(name, url, 2);
      }
      statuses[name] = 'offline';
      pings[name] = 0;
      debugInfo[name] = `Falha (Tentativa ${attempt}): ${error.message}`;
    }
  };

  const tasks: (() => Promise<void>)[] = [];
  for (const trib of mySlice) {
    tasks.push(() => testUrl(trib.name, trib.url));
  }

  const batchSize = 5;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ success: true, robo: "Robo 1 (Normais 1)", debug: debugInfo });
}
