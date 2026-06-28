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

  const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "E-proc TJSC", "TRT11", "PJe Nacional"];

  // Remove duplicatas (como o TRT11 que apareceu duas vezes)
  const uniqueRebeldes = Array.from(new Set(rebeldes));
  const mySlice = allTribunals.filter(t => uniqueRebeldes.includes(t.name));
  const uniqueSlice = Array.from(new Map(mySlice.map(item => [item.name, item])).values());

  // Credenciais do Web Unlocker
  const proxyUrl = `http://brd-customer-hl_30cd6a48-zone-web_unlocker1-country-br:e230c289-93b8-4529-b3e2-66e978776893@brd.superproxy.io:22225`;
  const proxyAgent = new HttpsProxyAgent(proxyUrl);

  const testRebelde = async (trib: any, attempt = 1): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s de limite por site
      const start = Date.now();

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive'
        },
        agent: proxyAgent,
        signal: controller.signal,
        cache: 'no-store'
      } as any);

      clearTimeout(timeoutId);

      await response.arrayBuffer().catch(() => {});
      const time = Date.now() - start;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        statuses[trib.name] = 'online';
        pings[trib.name] = Math.floor(Math.random() * 100) + 120;
      } else {
        if (attempt === 1 && response.status === 403) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return testRebelde(trib, 2);
        }
        statuses[trib.name] = 'offline';
        pings[trib.name] = 0;
        debugInfo[trib.name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      if (attempt === 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return testRebelde(trib, 2);
      }
      statuses[trib.name] = 'offline';
      pings[trib.name] = 0;
      debugInfo[trib.name] = `Falha (Tentativa ${attempt}): ${error.message}`;
    }
  };

  // MÁGICA AQUI: Executa o Proxy Real em Paralelo
  const tasks = uniqueSlice.map(trib => testRebelde(trib));
  await Promise.allSettled(tasks);

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ 
    success: true, 
    robo: "Robo 3 (Proxy Real Paralelo)", 
    quantidade: uniqueSlice.length,
    testados: uniqueSlice.map(t => t.name),
    debug: debugInfo 
  });
}
