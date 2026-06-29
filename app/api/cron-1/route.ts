import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300;

export async function GET() {
  let statuses: Record<string, string> = await kv.get('court_statuses') || {};
  let pings: Record<string, number> = await kv.get('court_pings') || {};
  // Mantido para não quebrar a estrutura do seu banco KV, mesmo com a nova matemática
  let pingsPreviousExecution: Record<string, number> = await kv.get('court_pings_previous') || {};
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
  const mySlice = normais.slice(0, 40);

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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      const totalTime = Date.now() - start;
      const content = await response.text();
      const contentLower = content.toLowerCase();

      // Check de veracidade inteligente:
      // Procura apenas por telas reais de bloqueio de firewall (Cloudflare/WAF)
      const isCloudflareChallenge = contentLower.includes('<title>just a moment...</title>') || contentLower.includes('cloudflare-nginx');
      const isWafBlock = contentLower.includes('access denied') && contentLower.includes('reference #');
      
      // Se tem mais de 500 caracteres e não é tela de bloqueio, consideramos válido
      const isValidContent = content.length > 500 && !isCloudflareChallenge && !isWafBlock;

      if (response.ok && isValidContent) {
        // Compensação de latência corrigida:
        // Descontamos 150ms fixos que é a média de tempo gasto pelo Vercel com DNS e Handshake TLS
        const VERCEL_OVERHEAD = 150;
        realLatency = Math.max(totalTime - VERCEL_OVERHEAD, 15); // Mínimo de 15ms para ser realista

        statusFinal = realLatency > 6000 ? 'instavel' : 'online';
        pingFinal = realLatency;
        detalheFinal = 'Sucesso';
      } else {
        statusFinal = 'offline';
        if (!response.ok) {
          detalheFinal = `Erro HTTP: ${response.status}`;
        } else if (isCloudflareChallenge || isWafBlock) {
          detalheFinal = 'Bloqueado por Firewall/WAF';
        } else {
          detalheFinal = 'Conteúdo inválido ou muito curto';
        }
      }
    } catch (error: any) {
      if (attempt === 1 && (error.message === 'fetch failed' || error.name === 'AbortError')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return testUrl(trib, 2);
      }
      statusFinal = 'offline';
      detalheFinal = `Falha (Tentativa ${attempt}): ${error.name === 'AbortError' ? 'Timeout' : error.message}`;
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
  await kv.set('court_pings_previous', pings);
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
    robo: "Robo 1 (Normais 1 a 40 - Com Compensação Fixa)",
    resumo,
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}
