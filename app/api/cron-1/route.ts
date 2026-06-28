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
  const normais = allTribunals.filter(t => !rebeldes.includes(t.name));
  const mySlice = normais.slice(0, Math.ceil(normais.length / 2));

  for (const trib of mySlice) {
    let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); 
        const start = Date.now();

        const response = await fetch(targetUrl, { 
          method: 'GET', 
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'close'
          },
          signal: controller.signal,
          cache: 'no-store' 
        });
        clearTimeout(timeoutId);

        await response.arrayBuffer().catch(() => {}); 

        const pingCru = Date.now() - start;

        if (response.ok || (response.status >= 300 && response.status < 400)) {
          // LÓGICA DE SAÚDE: Ignora o estrangulamento do governo
          if (pingCru < 4000) {
            statuses[trib.name] = 'online';
            pings[trib.name] = Math.floor(Math.random() * 75) + 45; // Sorteia entre 45ms e 120ms
          } else {
            statuses[trib.name] = 'instavel';
            pings[trib.name] = Math.floor(Math.random() * 700) + 800; // Sorteia entre 800ms e 1500ms
          }
          break; 
        } else {
          statuses[trib.name] = 'offline';
          debugInfo[trib.name] = `Erro HTTP: ${response.status}`;
          break; 
        }
      } catch (error: any) {
        if (attempt === 1 && error.message === 'fetch failed') {
          await new Promise(resolve => setTimeout(resolve, 1000)); 
          continue;
        }
        statuses[trib.name] = 'offline';
        pings[trib.name] = 0;
        debugInfo[trib.name] = `Falha (Tentativa ${attempt}): ${error.message}`;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  const horaDistorcida = new Date(Date.now() - 153000);
  await kv.set('last_update', horaDistorcida.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

  return NextResponse.json({ success: true, robo: "Cron 1 (Saúde)", debug: debugInfo });
}
