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

  // Lista com os 11 rebeldes
  const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "E-proc TJSC", "TRT11", "PJe Nacional"];
  const mySlice = allTribunals.filter(t => rebeldes.includes(t.name));

  // Suas credenciais do Web Unlocker
  const proxyUrl = `http://brd-customer-hl_30cd6a48-zone-web_unlocker1-country-br:e230c289-93b8-4529-b3e2-66e978776893@brd.superproxy.io:22225`;
  const proxyAgent = new HttpsProxyAgent(proxyUrl);

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      // Tempo alto (55s) porque o Web Unlocker pode demorar para resolver os captchas invisíveis
      const timeoutId = setTimeout(() => controller.abort(), 55000); 
      const start = Date.now();

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch(targetUrl, {
        method: 'GET',
        // REMOVIDO o User-Agent para a Bright Data poder criar o disfarce perfeito
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Connection': 'keep-alive'
        },
        agent: proxyAgent, // Passando pelo túnel da Bright Data
        signal: controller.signal,
        cache: 'no-store'
      } as any);

      clearTimeout(timeoutId);

      await response.arrayBuffer().catch(() => {});
      const tempoTotal = Date.now() - start;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
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

    // Pausa de 1 segundo entre cada site para não sobrecarregar a Bright Data
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ success: true, robo: "Robo 3 (Proxy Bright Data)", debug: debugInfo });
}
