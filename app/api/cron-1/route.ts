import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// Usando o poder do Plano Pro: 5 minutos de limite!
export const maxDuration = 300; 

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

  const mySlice = allTribunals.slice(0, 40);

  for (const trib of mySlice) {
    try {
      const controller = new AbortController();
      // Aumentamos a paciência para 15 segundos!
      const timeoutId = setTimeout(() => controller.abort(), 15000); 
      const start = Date.now();

      // Truque Anti-Firewall: Adiciona um número aleatório no final do link
      const bypassUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch(bypassUrl, { 
        method: 'GET', 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Connection': 'close',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);

      await response.arrayBuffer(); 

      const time = Date.now() - start;

      if (response.ok) {
        statuses[trib.name] = time > 5000 ? 'instavel' : 'online';
      } else {
        statuses[trib.name] = 'offline';
        debugInfo[trib.name] = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      statuses[trib.name] = 'offline';
      debugInfo[trib.name] = `Falha: ${error.message}`;
    }

    // Pausa de meio segundo para ser ainda mais discreto
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await kv.set('court_statuses', statuses);

  return NextResponse.json({ success: true, robo: "Robo 1 (0 a 40)", debug: debugInfo });
}
