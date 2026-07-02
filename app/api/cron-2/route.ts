import { NextResponse } from 'next/server';
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

  const doc = await collection.findOne({ _id: "current_statuses" });
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
  const mySlice = normais.slice(40);

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
      if (response.ok || (response.status >= 300 && response.status <