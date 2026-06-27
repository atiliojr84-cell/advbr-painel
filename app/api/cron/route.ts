import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

// Estas duas linhas proíbem o Next.js de fazer cache da rota
export const dynamic = 'force-dynamic';
export const revalidate = 0;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  const statuses: Record<string, string> = {};

  const testUrl = async (name: string, url: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); 
      const start = Date.now();

      // O cache: 'no-store' obriga a bater no servidor do tribunal de verdade
      const response = await fetch(url, { 
        method: 'HEAD', 
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

  const promises = [];

  for (const trib of jurisdictions.federais) {
    promises.push(testUrl(trib.name, trib.url));
  }

  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      for (const trib of estados[estado]) {
        promises.push(testUrl(trib.name, trib.url));
      }
    }
  }

  await Promise.allSettled(promises);
  await kv.set('court_statuses', statuses);

  return NextResponse.json({ success: true, total: Object.keys(statuses).length });
}
