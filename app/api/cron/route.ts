import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Limite máximo da Vercel

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  // Pega os status antigos para não zerar o painel caso a Vercel corte o tempo
  let statuses: Record<string, string> = await kv.get('court_statuses') || {};

  const testUrl = async (name: string, url: string) => {
    try {
      const controller = new AbortController();
      // Limite de 5 segundos. Mais que isso, consideramos fora do ar.
      const timeoutId = setTimeout(() => controller.abort(), 5000); 
      const start = Date.now();

      const response = await fetch(url, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;

      if (response.ok) {
        statuses[name] = time > 3000 ? 'instavel' : 'online';
      } else {
        statuses[name] = 'offline';
      }
    } catch (error) {
      statuses[name] = 'offline';
    }
  };

  const tasks: (() => Promise<void>)[] = [];

  for (const trib of jurisdictions.federais) {
    tasks.push(() => testUrl(trib.name, trib.url));
  }

  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      for (const trib of estados[estado]) {
        tasks.push(() => testUrl(trib.name, trib.url));
      }
    }
  }

  // Lotes de 25 para terminar tudo em cerca de 20 a 30 segundos (dentro do limite da Vercel)
  const batchSize = 25;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(task => task()));
  }

  // Salva no banco de dados
  await kv.set('court_statuses', statuses);

  return NextResponse.json({ success: true, total: Object.keys(statuses).length });
}
