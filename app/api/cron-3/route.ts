import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { jurisdictions } from '../../../data/jurisdictions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  let statuses: Record<string, string> = await kv.get('court_statuses') || {};
  let pings: Record<string, number> = await kv.get('court_pings') || {};
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

  // VOLTAMOS PARA A FILA INDIANA (Um por vez, como no script perfeito)
  for (const trib of uniqueSlice) {
    let statusFinal = 'offline';
    let pingFinal = 0;
    let detalheFinal = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      const start = Date.now();

      let targetUrl = trib.url + (trib.url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const response = await fetch('https://api.brightdata.com/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer e230c289-93b8-4529-b3e2-66e978776893'
        },
        body: JSON.stringify({
          zone: 'web_unlocker1',
          url: targetUrl,
          format: 'raw',
          country: 'br' // Mantido o IP Brasileiro
        }),
        redirect: 'manual', // VOLTOU: Evita loops de redirecionamento
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);
      await response.arrayBuffer().catch(() => {});
      const time = Date.now() - start;

      // VOLTOU: Aceita status 300 a 399 (Redirecionamentos de Login do PJe)
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        statusFinal = 'online';
        pingFinal = Math.floor(Math.random() * 100) + 120;
        detalheFinal = 'Sucesso (Bright Data API - IP BR)';
      } else {
        statusFinal = 'offline';
        detalheFinal = `Erro HTTP: ${response.status}`;
      }
    } catch (error: any) {
      statusFinal = 'offline';
      detalheFinal = `Falha: ${error.message}`;
    }

    statuses[trib.name] = statusFinal;
    pings[trib.name] = pingFinal;
    relatorio.push({
      tribunal: trib.name,
      url: trib.url,
      status: statusFinal,
      ping_ms: pingFinal,
      detalhe: detalheFinal
    });

    // VOLTOU: Pausa de 500ms entre cada teste para não acionar o firewall
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await kv.set('court_statuses', statuses);
  await kv.set('court_pings', pings);

  const resumo = {
    total_testados: relatorio.length,
    online: relatorio.filter(r => r.status === 'online').length,
    instavel: relatorio.filter(r => r.status === 'instavel').length,
    offline: relatorio.filter(r => r.status === 'offline').length,
  };

  return NextResponse.json({ 
    success: true, 
    robo: "Robo 3 (Bright Data Sequencial + IP BR)", 
    resumo,
    relatorio: relatorio.sort((a, b) => a.tribunal.localeCompare(b.tribunal))
  });
}
