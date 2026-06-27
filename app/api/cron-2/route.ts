import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300; 

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  let statuses: Record<string, string> = await kv.get('court_statuses') || {};
  let debugInfo: Record<string, string> = {}; 

  const allTribunals = [...jurisdictions.federais];
  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      allTribunals.push(...estados[estado]);
    }
  }

  const mySlice = allTribunals.slice(40, 80);

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); 
      const start = Date.now();

      // PJe TJBA adicionado na lista VIP
      const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "PJe TJBA"];
      const apiKey = "5ca76d0bb31b21b469c22ec3c8dc94f4";

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      if (rebeldes.includes(trib.name)) {
        targetUrl = `http://api.scraperapi.com?api_key=${apiKey}&country_code=br&url=${encodeURIComponent(trib.url)}`;
      }

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

      const time = Date.now() - start;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        statuses[trib.name] = time > 5000 ? 'instavel' : 'online';
      } else {
        statuses[trib.name] = 'offline';
        debugInfo[trib.name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      statuses[trib.name] = 'offline';

      let cause = 'Desconhecida';
      if (error.cause) {
        cause = error.cause.code || error.cause.message || JSON.stringify(error.cause);
      }
      debugInfo[trib.name] = `Falha: ${error.message} | Causa: ${cause}`;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await kv.set('court_statuses', statuses);

  return NextResponse.json({ success: true, robo: "Robo 2 (40 a 80)", debug: debugInfo });
}
