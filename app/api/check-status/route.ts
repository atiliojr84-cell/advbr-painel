// app/api/check-status/route.ts
import { NextResponse } from 'next/server';

// Ignora erros de certificado SSL (MUITO comum em sites de tribunais brasileiros)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    const controller = new AbortController();
    // Se demorar mais de 6 segundos, consideramos instável/offline
    const timeoutId = setTimeout(() => controller.abort(), 6000); 

    const start = Date.now();

    // Fazemos um 'HEAD' request, que baixa só o cabeçalho (muito mais rápido que baixar o site todo)
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const time = Date.now() - start;

    if (response.ok) {
      // Se respondeu, mas demorou mais de 3 segundos, fica AMARELO (Instável)
      if (time > 3000) return NextResponse.json({ status: 'instavel' }); 
      // Se foi rápido, fica VERDE (Online)
      return NextResponse.json({ status: 'online' }); 
    } else {
      // Se deu erro 404, 500, etc, fica VERMELHO (Offline)
      return NextResponse.json({ status: 'offline' }); 
    }
  } catch (error) {
    // Se o site não existe ou deu timeout, fica VERMELHO (Offline)
    return NextResponse.json({ status: 'offline' }); 
  }
}
