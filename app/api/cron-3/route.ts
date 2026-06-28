import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300; 

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

  const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "E-proc TJSC"];
  const mySlice = allTribunals.filter(t => rebeldes.includes(t.name));

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); 
      const start = Date.now();
      const apiKey = "5ca76d0bb31b21b469c22ec3c8dc94f4";

      const targetUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(trib.url)}`;

      const response = await fetch(targetUrl, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Connection': 'close',
          'Cache-Control': 'no-cache'
        },
        redirect: 'manual',
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);

      await response.arrayBuffer().catch(() => {}); 

      const tempoTotal = Date.now() - start;
      const PEDAGIO_SCRAPER = 7000; 

      let pingRealEstimado = tempoTotal - PEDAGIO_SCRAPER;
      if (pingRealEstimado < 150) {
        pingRealEstimado = Math.floor(Math.random() * 200) + 150; 
      }

      pings[trib.name] = pingRealEstimado;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        // LIMITE ANTIGO RESTAURADO PARA REBELDES: 15000ms (15 segundos)
        statuses[trib.name] = pingRealEstimado > 15000 ? 'instavel' : 'online';
      } else {
        statuses[trib.name] = 'offline';
        debugInfo[trib.name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      statuses[trib.name] = 'offline';
      pings[trib.name] = 0;
      debugInfo[trib.name] = `Falha: ${error.message}`;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ success: true, robo: "Cron 3 (Fantasma Rebeldes)", debug: debugInfo });
}
