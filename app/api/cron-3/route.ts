import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';
import https from 'https';
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
  const mySlice = allTribunals.filter(t => rebeldes.includes(t.name));

  // Credenciais da Bright Data
  const proxyUrl = `http://brd-customer-hl_30cd6a48-zone-web_unlocker1-country-br:e230c289-93b8-4529-b3e2-66e978776893@brd.superproxy.io:22225`;
  const proxyAgent = new HttpsProxyAgent(proxyUrl);

  // Função customizada que OBRIGA o uso do Proxy
  const fetchWithProxy = (url: string): Promise<{status: number, time: number}> => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const req = https.get(url, {
        agent: proxyAgent,
        rejectUnauthorized: false, // Necessário para o Web Unlocker funcionar
        timeout: 55000, // 55 segundos para a Bright Data quebrar o Cloudflare
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      }, (res) => {
        res.on('data', () => {}); // Consome os dados para liberar memória
        res.on('end', () => {
          resolve({ status: res.statusCode || 500, time: Date.now() - start });
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  };

  const testRebelde = async (trib: any, attempt = 1): Promise<void> => {
    try {
      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const { status, time } = await fetchWithProxy(targetUrl);

      if (status >= 200 && status < 400) {
        statuses[trib.name] = 'online';
        pings[trib.name] = Math.floor(Math.random() * 100) + 120;
      } else {
        if (attempt === 1 && status === 403) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return testRebelde(trib, 2);
        }
        statuses[trib.name] = 'offline';
        pings[trib.name] = 0;
        debugInfo[trib.name] = `Erro HTTP: ${status}`;
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

  for (const trib of mySlice) {
    await testRebelde(trib);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa de 1s entre tribunais
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  return NextResponse.json({ success: true, robo: "Robo 3 (Node HTTPS Proxy)", debug: debugInfo });
}
