import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; 

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  let statuses: Record<string, string> = await kv.get('court_statuses') || {};
  let debugInfo: Record<string, string> = {}; 

  // 1. Junta todos os 115 tribunais em uma lista só
  const allTribunals = [...jurisdictions.federais];
  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      allTribunals.push(...estados[estado]);
    }
  }

  // 2. A MÁGICA: O Robô 1 pega apenas do site 0 até o 40
  const mySlice = allTribunals.slice(0, 40);

  // 3. Testa um por um (Fila Indiana)
  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); 
      const start = Date.now();

      const response = await fetch(trib.url, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Connection': 'keep-alive' 
        },
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);

      const time = Date.now() - start;

      if (response.ok) {
        statuses[trib.name] = time > 4000 ? 'instavel' : 'online';
      } else {
        statuses[trib.name] = 'offline';
        debugInfo[trib.name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      statuses[trib.name] = 'offline';
      debugInfo[trib.name] = `Falha: ${error.message}`;
    }

    // Pausa de 200ms entre cada site
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await kv.set('court_statuses', statuses);

  return NextResponse.json({ 
    success: true, 
    robo: "Robo 1 (0 a 40)",
    total_testados: mySlice.length,
    debug: debugInfo
  });
}
