import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Definições de tempo para status (Robô 01)
const TIMEOUT_VERMELHO_MS = 5000;  // Tempo máximo para considerar offline (5 segundos)
const TIMEOUT_AMARELO_MS = 2000;   // Tempo a partir do qual considera instável (2 segundos)
const DELAY_ENTRE_TENTATIVAS_MS = 2000; // 2 segundos de delay entre as retentativas

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
  const normais = allTribunals.filter(t => !rebeldes.includes(t.name));

  const mySlice = normais.slice(0, 40); // Robô 1 testa os primeiros 40 tribunais "normais"

  // Função auxiliar para fazer uma única requisição e determinar seu status
  async function fazerRequisicaoUnica(url: string, attempt: number): Promise<{ status: string; ping: number; detalhe: string }> {
    let status = 'offline';
    let ping = 0;
    let detalhe = '';
try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() =&gt; controller.abort(), TIMEOUT_VERMELHO_MS); // Timeout geral
  const start = Date.now();

  const response = await fetch(url, {
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

  const time = Date.now() - start;

  if (response.ok || (response.status &gt;= 300 &amp;&amp; response.status &lt; 400)) {
    if (time &gt; TIMEOUT_AMARELO_MS) {
      status = 'instavel'; // OK, mas com latência alta
      detalhe = `Sucesso (Instável - ${time}ms)`;
    } else {
      status = 'online'; // OK e rápido
      detalhe = `Sucesso (${time}ms)`;
    }
    ping = time;
  } else {
    status = 'offline';
    detalhe = `Erro HTTP: ${response.status}`;
  }
} catch (error: any) {
  if (error.name === 'AbortError') {
    detalhe = `Falha (Timeout de ${TIMEOUT_VERMELHO_MS}ms)`;
  } else {
    detalhe = `Falha: ${error.message}`;
  }
  status = 'offline';
}

return { status, ping, detalhe };
  }

  // Função principal de teste com a lógica de retentativas
  const testUrlComRetentativas = async (trib: any): Promise<void> => {
    let statusFinal = 'offline';
    let pingFinal = 0;
    let detalheFinal = '';
// Primeira tentativa
let res1 = await fazerRequisicaoUnica(trib.url, 1);
statusFinal = res1.status;
pingFinal = res1.ping;
detalheFinal = res1.detalhe;

if (statusFinal === 'online') {
  // Verde de primeira, não precisa de mais testes
  // console.log(`[${trib.name}] Verde de primeira.`);
} else if (statusFinal === 'instavel') {
  // Amarelo de primeira, faz mais uma tentativa
  // console.log(`[${trib.name}] Instável na primeira, tentando novamente...`);
  await new Promise(resolve =&gt; setTimeout(resolve, DELAY_ENTRE_TENTATIVAS_MS));
  let res2 = await fazerRequisicaoUnica(trib.url, 2);
  statusFinal = res2.status;
  pingFinal = res2.ping;
  detalheFinal = res2.detalhe;
  // console.log(`[${trib.name}] Resultado da segunda tentativa (instável): ${statusFinal}`);
} else { // statusFinal === 'offline'
  // Vermelho de primeira, faz mais duas tentativas (total de 3)
  // console.log(`[${trib.name}] Offline na primeira, tentando mais duas vezes...`);
  await new Promise(resolve =&gt; setTimeout(resolve, DELAY_ENTRE_TENTATIVAS_MS));
  let res2 = await fazerRequisicaoUnica(trib.url, 2);
  statusFinal = res2.status;
  pingFinal = res2.ping;
  detalheFinal = res2.detalhe;

  if (statusFinal === 'offline') {
    // Ainda offline na segunda, faz a terceira
    await new Promise(resolve =&gt; setTimeout(resolve, DELAY_ENTRE_TENTATIVAS_MS));
    let res3 = await fazerRequisicaoUnica(trib.url, 3);
    statusFinal = res3.status;
    pingFinal = res3.ping;
    detalheFinal = res3.detalhe;
    // console.log(`[${trib.name}] Resultado da terceira tentativa (offline): ${statusFinal}`);
  } else {
    // Voltou para online/instavel na segunda tentativa
    // console.log(`[${trib.name}] Voltou para ${statusFinal} na segunda tentativa.`);
  }
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

  const tasks = mySlice.map(trib => () => testUrlComRetentativas(trib));
  const batchSize = 5; // Mantém o processamento em lotes
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 200)); // Pequeno delay entre lotes
  }

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
    robo: "Robo 1 (Normais 1 a 40) - Retentativas Inteligentes", // Nome atualizado para refletir a mudança
    resumo,
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}
