import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300;

export async function GET() {
  let statuses: Record<string, string> = await kv.get('court_statuses') || {};
  let pings: Record<string, number> = await kv.get('court_pings') || {};
  let pingsPreviousExecution: Record<string, number> = await kv.get('court_pings_previous_chrome2') || {};
  const relatorio: any[] = [];

  const allTribunals = [...jurisdictions.federais];
  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      allTribunals.push(...estados[estado]);
    }
  }

  const rebeldes = ["TRF3", "TJPB", "TJRN", "TJGO", "TRT13", "TJDFT", "TJRS", "PJe TJES", "E-proc TJSC", "TRT11", "PJe Nacional"];
  const normais = allTribunals.filter(t => !rebeldes.includes(t.name));
  const mySlice = normais.slice(40);

  const testUrl = async (trib: any, attempt = 1): Promise<void> => {
    let statusFinal = 'offline';
    let pingFinal = 0;
    let realLatency = 0;
    let detalheFinal = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const start = Date.now();

      const response = await fetch(trib.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Connection': 'close'
        },
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      const totalTime = Date.now() - start;

      // Valida se o conteúdo é real
      const content = await response.text();
      const isValidContent = 
        content.length > 200 && 
        !content.includes('403') && 
        !content.includes('404') &&
        !content.includes('captcha') &&
        !content.toLowerCase().includes('blocked') &&
        !content.toLowerCase().includes('access denied');

      if ((response.ok || (response.status >= 300 && response.status < 400)) && isValidContent) {
        // Calcula compensação dinâmica usando execução anterior
        const previousPing = pingsPreviousExecution[trib.name];
        
        if (previousPing && previousPing > 0) {
          // Tem execução anterior: calcula overhead dinamicamente
          const overhead = Math.max(totalTime - previousPing, 0);
          realLatency = Math.max(previousPing - overhead, 10);
        } else {
          // Primeira execução: usa overhead fixo de 30ms
          realLatency = Math.max(totalTime - 30, 10);
        }

        statusFinal = realLatency > 6000 ? 'instavel' : 'online';
        pingFinal = realLatency;
        detalheFinal = 'Sucesso';
      } else {
        statusFinal = 'offline';
        detalheFinal = isValidContent ? `Erro HTTP: ${response.status}` : 'Conteúdo inválido (página de erro)';
      }
    } catch (error: any) {
      if (attempt === 1 && (error.message === 'fetch failed' || error.name === 'AbortError')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return testUrl(trib, 2);
      }
      statusFinal = 'offline';
      detalheFinal = `Falha (Tentativa ${attempt}): ${error.message}`;
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
  };

  const tasks = mySlice.map(trib => () => testUrl(trib));
  const batchSize = 5;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Salva os pings atuais para próxima execução
  await kv.set('court_pings_previous_chrome2', pings);
  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  // Camuflagem de Segurança: Atrasa a hora registrada entre 60 e 120 segundos
  const atrasoFake = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;
  const horaCamuflada = new Date(Date.now() - atrasoFake).toISOString();
  await kv.set('last_update', horaCamuflada);

  const resumo = {
    total_testados: relatorio.length,
    online: relatorio.filter(r => r.status === 'online').length,
    instavel: relatorio.filter(r => r.status === 'instavel').length,
    offline: relatorio.filter(r => r.status === 'offline').length,
  };

  return NextResponse.json({
    success: true,
    robo: "Robo 2 (Normais 41+ - Com Compensação Dinâmica)",
    resumo,
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}
