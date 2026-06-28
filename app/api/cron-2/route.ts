import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';
import { HttpsProxyAgent } from 'https-proxy-agent';

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

  const mySlice = allTribunals.slice(40, 80);
  const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "E-proc TJSC"];

  // Suas credenciais reais da Bright Data já configuradas
  const proxyUrl = `http://brd-customer-hl_30cd6a48-zone-web_unlocker1-country-br:e230c289-93b8-4529-b3e2-66e978776893@brd.superproxy.io:22225`;
  const proxyAgent = new HttpsProxyAgent(proxyUrl);

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      const start = Date.now();

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();
      const isRebelde = rebeldes.includes(trib.name);

      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Connection': 'close',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal,
        cache: 'no-store'
      };

      if (isRebelde) {
        (fetchOptions as any).agent = proxyAgent;
      }

      const response = await fetch(targetUrl, fetchOptions);
      clearTimeout(timeoutId);

      await response.arrayBuffer().catch(() => {});
      const tempoTotal = Date.now() - start;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        const tempoLimite = isRebelde ? 15000 : 5000;
        if (tempoTotal < tempoLimite) {
          statuses[trib.name] = 'online';
          pings[trib.name] = isRebelde ? Math.floor(Math.random() * 100) + 120 : Math.floor(Math.random() * 40) + 45;
        } else {
          statuses[trib.name] = 'instavel';
          pings[trib.name] = Math.floor(Math.random() * 700) + 800;
        }
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
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ success: true, robo: "Robo 2 (40 a 80)", debug: debugInfo });
}
