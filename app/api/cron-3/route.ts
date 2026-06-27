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

  const allTribunals = [...jurisdictions.federais];
  for (const regiao in jurisdictions.regioes) {
    const estados = (jurisdictions.regioes as any)[regiao];
    for (const estado in estados) {
      allTribunals.push(...estados[estado]);
    }
  }

  // ROBÔ 3: Pega a fatia do 80 até o final da lista
  const mySlice = allTribunals.slice(80);

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); 
      const start = Date.now();

      const response = await fetch(trib.url, { 
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

      // Consome o corpo da resposta para fechar a porta e evitar o "fetch failed"
      await response.arrayBuffer(); 

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

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await kv.set('court_statuses', statuses);

  return NextResponse.json({ success: true, robo: "Robo 3 (80 ao fim)", debug: debugInfo });
}
