import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return NextResponse.json({ error: 'Forneça uma URL' });

  try {
    const start = Date.now();

    // Vamos tentar com GET e uma identidade falsa de navegador (User-Agent)
    const response = await fetch(url, {
      method: 'GET', 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      cache: 'no-store'
    });

    const time = Date.now() - start;

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      timeMs: time,
      urlTested: url
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      errorName: error.name,
      errorMessage: error.message,
      urlTested: url
    });
  }
}
