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
  let pingsPreviousExecution: Record<string, number> = await kv.get('court_pings_previous_chrome3') || {};
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

  // Executa todos os testes SIMULTANEAMENTE (Modo Turbo)
  const resultados = await Promise.all(uniqueSlice.map(async (trib) => {
    let statusFinal = 'offline';
    let pingFinal = 0;
    let realLatency = 0;
    let detalheFinal = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      const start = Date.now();

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch('https://api.brightdata.com/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}`
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
      const totalTime = Date.now() - start;
      const content = await response.arrayBuffer().catch(() => Buffer.alloc(0));
      const contentLength = (content as any).byteLength || 0;

      // Valida se o conteúdo é real
      const isValidContent = contentLength > 200 && response.status !== 403 && response.status !== 404;

      // Se a Bright Data conseguiu passar pelo bloqueio (Sucesso)
      if ((response.ok || (response.status >= 300 && response.status < 400)) && isValidContent) {
        // Calcula compensação dinâmica usando execução anterior
        const previousPing = pingsPreviousExecution[trib.name];
        
        if (previousPing && previousPing > 0) {
          // Tem execução anterior: calcula overhead dinamicamente
          const overhead = Math.max(totalTime - previousPing, 0);
          realLatency = Math.max(previousPing - overhead, 10);
        } else {
          // Primeira execução: usa overhead fixo de 135ms (Bright Data)
          realLatency = Math.max(totalTime - 135, 10);
        }

        statusFinal = realLatency > 6000 ? 'instavel' : 'online';
        pingFinal = realLatency;
        detalheFinal = 'Sucesso (Bright Data API - IP BR - Compensação Dinâmica)';
      } else {
        statusFinal = 'offline';
        detalheFinal = isValidContent ? `Erro HTTP: ${response.status}` : 'Conteúdo inválido (página de erro)';
      }
    } catch (error: any) {
      statusFinal = 'offline';
      detalheFinal = `Falha: ${error.message}`;
    }

    return {
      tribunal: trib.name,
      url: trib.url,
      status: statusFinal,
      ping_ms: pingFinal,
      detalhe: detalheFinal
    };
  }));

  // Salva os resultados processados em paralelo
  for (const res of resultados) {
    statuses[res.tribunal] = res.status;
    pings[res.tribunal] = res.ping_ms;
    relatorio.push(res);
  }

  // Salva os pings atuais para próxima execução (compensação dinâmica)
  await kv.set('court_pings_previous_chrome3', pings);
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
    robo: "Robo 3 (Bright Data Paralelo + Compensação Dinâmica de Latência)",
    resumo,
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}
