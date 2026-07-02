import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; 

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  const client = await clientPromise;
  const db = client.db("advbr_reports_db");
  const collection = db.collection("court_statuses");

  let statuses: Record<string, string> = {};
  let debugInfo: Record<string, string> = {}; 

  const testUrl = async (name: string, url: string, attempt = 1): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); 
      const start = Date.now();

      const response = await fetch(url, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/122.0.0.0',
          'Accept': '*/*',
          'Connection': 'close'
        },
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;

      if (response.ok) {
        statuses[name] = time > 4000 ? 'instavel' : 'online';
      } else {
        statuses[name] = 'offline';
        if (name.toLowerCase().includes('pje')) debugInfo[name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      if (attempt === 1 && error.message === 'fetch failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return testUrl(name, url, 2);
      }
      statuses[name] = 'offline';
    }
  };

  const tasks: (() => Promise<void>)[] = [];
  for (const trib of jurisdictions.federais) tasks.push(() => testUrl(trib.name, trib.url));
  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      for (const trib of estados[estado]) tasks.push(() => testUrl(trib.name, trib.url));
    }
  }

  const batchSize = 5;
  for (let i = 0; i < tasks.length; i += batchSize) {
    await Promise.allSettled(tasks.slice(i, i + batchSize).map(task => task()));
    await new Promise(resolve => setTimeout(resolve, 200)); 
  }

  // Salva ou atualiza o documento no MongoDB
  await collection.updateOne(
    { _id: "current_statuses" },
    { $set: { data: statuses, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ 
    success: true, 
    total: Object.keys(statuses).length
  });
}