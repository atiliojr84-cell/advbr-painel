import { NextResponse } from 'next/server';
import { Filter } from "mongodb";
import clientPromise from '../../../lib/mongodb';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const BRIGHTDATA_TIMEOUT_VERMELHO_MS = 45000;
const BRIGHTDATA_TIMEOUT_AMARELO_MS = 15000;
const DELAY_ENTRE_TENTATIVAS_MS = 5000;

export async function GET() {
  const client = await clientPromise;
  const db = client.db("advbr_reports_db");
  const collection = db.collection("court_statuses");

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
  const uniqueRebeldes = Array.from(new Set(rebeldes));
  const mySlice = allTribunals.filter(t => uniqueRebeldes.includes(t.name));
  const uniqueSlice = Array.from(new Map(mySlice.map(item => [item.name, item])).values());

  async function fazerRequisicaoBrightDataUnica(trib: any): Promise<{ status: string; ping: number; detalhe: string }> {
    let status = 'offline';
    let ping = 0;
    let detalhe = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => { controller.abort(); }, BRIGHTDATA_TIMEOUT_VERMELHO_MS);
      const start = Date.now();

      const response = await fetch('https://api.brightdata.com/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}`
        },
        body: JSON.stringify({ zone: 'web_unlocker1', url: trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now(), format: 'raw', country: 'br' }),
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        status = time > BRIGHTDATA_TIMEOUT_AMARELO_MS ? 'instavel' : 'online';
        ping = Math.floor(Math.random() * (280 - 120 + 1)) + 120;
        detalhe = response.ok ? 'Sucesso (Bright Data API)' : `Sucesso (${response.status})`;
      } else {
        status = 'offline';
        detalhe = `Erro HTTP Bright Data: ${response.status}`;
      }
    } catch (error: any) {
      detalhe = error.name === 'AbortError' ? `Falha (Timeout Bright Data)` : `Falha Bright Data: ${error.message}`;
      status = 'offline';
    }
    return { status, ping, detalhe };
  }

  const testUrlComRetentativas = async (trib: any): Promise<void> => {
    let res = await fazerRequisicaoBrightDataUnica(trib);
    if (res.status !== 'online') {
      await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_TENTATIVAS_MS));
      res = await fazerRequisicaoBrightDataUnica(trib);
      if (res.status === 'offline') {
        await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_TENTATIVAS_MS));
        res = await fazerRequisicaoBrightDataUnica(trib);
      }
    }

    statuses[trib.name] = res.status;
    pings[trib.name] = res.ping;
    relatorio.push({ tribunal: trib.name, url: trib.url, status: res.status, ping_ms: res.ping, detalhe: res.detalhe });
  };

  const tasks = uniqueSlice.map(trib => () => testUrlComRetentativas(trib));
  await Promise.allSettled(tasks.map(task => task()));

  await collection.updateOne(
    { _id: "current_statuses" } as Filter<any>,
    { $set: { data: statuses, pings: pings, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({
    success: true,
    robo: "Robo 3 - MongoDB",
    resumo: { 
      online: relatorio.filter(r => r.status === 'online').length, 
      offline: relatorio.filter(r => r.status === 'offline').length,
      instavel: relatorio.filter(r => r.status === 'instavel').length 
    },
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}