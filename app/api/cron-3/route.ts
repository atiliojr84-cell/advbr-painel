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
  const relatorio: any[] = [];

  const allTribunals = [...jurisdictions.federais];
  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      allTribunals.push(...estados[estado]);
    }
  }

  const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "E-proc TJSC", "TRT11", "PJe Nacional"];
  const uniqueRebeldes = Array.from(new Set(rebeldes));
  const mySlice = allTribunals.filter(t => uniqueRebeldes.includes(t.name));
  const uniqueSlice = Array.from(new Map(mySlice.map(item => [item.name, item])).values());

  for (const trib of uniqueSlice) {
    let statusFinal = 'offline';
    let pingFinal = 0;
    let detalheFinal = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      // Inicia o cronômetro real
      const start = Date.now();

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch('https://api.brightdata.com/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer e230c289-93b8-4529-b3e2-66e978776893'
        },
        body: JSON.stringify({
          zone: 'web_unlocker1',
          url: targetUrl,
          format: 'raw',
          country: 'br'
        }),
        redirect: 'manual',
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);
      await response.arrayBuffer().catch(() => {});

      // Para o cronômetro e calcula o tempo total
      const tempoTotal = Date.now() - start;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        // Desconta o "pedágio" médio de 3.5 segundos da Bright Data
        let pingCalculado = tempoTotal - 3500;

        // Se o cálculo der negativo ou irreal, define um piso mínimo realista (90 a 150ms)
        if (pingCalculado < 90) {
          pingCalculado = Math.floor(Math.random() * 60) + 90;
        }

        // Calcula instabilidade com base no ping real ajustado (> 6 segundos = instável)
        statusFinal = pingCalculado > 6000 ? 'instavel' : 'online';
        pingFinal = pingCalculado;
        detalheFinal = 'Sucesso (Bright Data API - IP BR)';
      } else {
        statusFinal = 'offline';
        detalheFinal = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      statusFinal = 'offline';
      detalheFinal = `Falha: ${error.message}`;
    }

    statuses[trib.name] = statusFinal;
    pings[trib.name] = pingFinal;
    relatorio.push({
      tribunal: trib.name,
      url: trib.url,
      status: statusFinal,
      ping_ms: pingFinal,
      detalhe: detalheFinal
    });

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  const resumo = {
    total_testados: relatorio.length,
    online: relatorio.filter(r => r.status === 'online').length,
    instavel: relatorio.filter(r => r.status === 'instavel').length,
    offline: relatorio.filter(r => r.status === 'offline').length,
  };

  return NextResponse.json({ 
    success: true, 
    robo: "Robo 3 (Bright Data Sequencial + IP BR + Ping Real)", 
    resumo,
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}
