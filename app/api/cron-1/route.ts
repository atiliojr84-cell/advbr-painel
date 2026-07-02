import { NextResponse } from 'next/server';
import { Filter } from "mongodb";
import clientPromise from '../../../lib/mongodb';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const TIMEOUT_VERMELHO_MS = 5000;
const TIMEOUT_AMARELO_MS = 2000;
const DELAY_ENTRE_TENTATIVAS_MS = 2000;

export async function GET() {
  const client = await clientPromise;
  const db = client.db("advbr_reports_db");
  const collection = db.collection("court_statuses");

  // Correção de tipagem para o filtro do _id
  const doc = await collection.findOne({ _id: "current_statuses" } as Filter<any>);
  let statuses: Record<string, string> = doc?.data || {};
  let pings: Record<string, number> = doc?.pings || {};
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

  async function fazerRequisicaoUnica(url: string, attempt: number): Promise<{ status: string; ping: number; detalhe: string }> {
    let status = 'offline';
    let ping = 0;
    let detalhe = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => { controller.abort(); }, TIMEOUT_VERMELHO_MS);
      const start = Date.now();

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': '*/*', 'Connection': 'close' },
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        status = time > TIMEOUT_AMARELO_MS ? 'instavel' : 'online';
        ping = time;
        detalhe = response.ok ? `Sucesso (${time}ms)` : `Sucesso (${response.status})`;
      } else {
        status = 'offline';
        detalhe = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      detalhe = error.name === 'AbortError' ? `Falha (Timeout)` : `Falha: ${error.message}`;
      status = 'offline';
    }
    return { status, ping, detalhe };
  }

  const testUrlComRetentativas = async (trib: any): Promise<void> => {
    let res = await fazerRequisicaoUnica(trib.url, 1);
    if (res.status !== 'online') {
      await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_TENTATIVAS_MS));
      res = await fazerRequisicaoUnica(trib.url, 2);
      if (res.status === 'offline') {
        await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_TENTATIVAS_MS));
        res = await fazerRequisicaoUnica(trib.url, 3);
      }
    }

    statuses[trib.name] = res.status;
    pings[trib.name] = res.ping;
    relatorio.push({ tribunal: trib.name, url: trib.url, status: res.status, ping_ms: res.ping, detalhe: res.detalhe });
  };

  const tasks = mySlice.map(trib => () => testUrlComRetentativas(trib));
  const batchSize = 5;
  for (let i = 0; i < tasks.length; i += batchSize) {
    await Promise.allSettled(tasks.slice(i, i + batchSize).map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await collection.updateOne(
    { _id: "current_statuses" } as Filter<any>,
    { $set: { data: statuses, pings: pings, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({
    success: true,
    robo: "Robo 1 - MongoDB",
    resumo: { online: relatorio.filter(r => r.status === 'online').length, offline: relatorio.filter(r => r.status === 'offline').length },
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}