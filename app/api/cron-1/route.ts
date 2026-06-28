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

  const rebeldes = ["TJBA", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES"];
  const normalTribunals = allTribunals.filter(t => !rebeldes.includes(t.name));

  // Pega a primeira metade dos sites normais
  const mySlice = normalTribunals.slice(0, Math.ceil(normalTribunals.length / 2));

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      const start = Date.now();

      const targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch(targetUrl, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
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

      const pingReal = Date.now() - start;
      pings[trib.name] = pingReal;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        statuses[trib.name] = pingReal > 500 ? 'instavel' : 'online';
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

  // Atualiza o relógio do site com a camuflagem
  const horaDistorcida = new Date(Date.now() - 153000);
  await kv.set('last_update', horaDistorcida.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

  return NextResponse.json({ success: true, robo: "Cron 1 (Normais Parte 1)", debug: debugInfo });
}
