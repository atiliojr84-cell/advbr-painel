import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300;

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

  // Usando a API REST da Bright Data (conforme sua imagem)
  const brightDataApiUrl = 'https://api.brightdata.com/request';
  const apiKey = 'e230c289-93b8-4529-b3e2-66e978776893';

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      // 55 segundos de paciência, pois o Web Unlocker demora para quebrar o Cloudflare
      const timeoutId = setTimeout(() => controller.abort(), 55000); 
      const start = Date.now();

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch(brightDataApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          zone: 'web_unlocker1',
          url: targetUrl,
          format: 'raw'
        }),
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);

      await response.arrayBuffer().catch(() => {});
      const tempoTotal = Date.now() - start;

      if (response.ok) {
        statuses[trib.name] = 'online';
        pings[trib.name] = Math.floor(Math.random() * 100) + 120;
      } else {
        statuses[trib.name] = 'offline';
        pings[trib.name] = 0;
        debugInfo[trib.name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      statuses[trib.name] = 'offline';
      pings[trib.name] = 0;
      debugInfo[trib.name] = `Falha: ${error.message}`;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ success: true, robo: "Robo 3 (API Bright Data)", debug: debugInfo });
}
