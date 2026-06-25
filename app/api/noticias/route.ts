import { NextResponse } from 'next/server';

export async function GET() {
  const fontes = [
    { nome: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
    { nome: "OAB-BR", url: "https://www.oab.org.br/rss" },
    { nome: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
    { nome: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" },
    { nome: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
    { nome: "TRF4", url: "https://www.trf4.jus.br/trf4/noticias.xml" },
    { nome: "JUSTICA-FOCO", url: "https://www.justicaemfoco.com.br/feed" }
  ];

  const todasNoticias: Array<{texto: string, url: string}> = [];

  for (const fonte of fontes) {
    try {
      // Usamos o serviço rss2json para garantir que o feed seja lido sem bloqueio
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(fonte.url)}`;
      const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
      const data = await res.json();
      
      if (data.items) {
        data.items.slice(0, 3).forEach((item: any) => {
          todasNoticias.push({ 
            texto: `[${fonte.nome}] ${item.title}`, 
            url: item.link 
          });
        });
      }
    } catch (e) { continue; }
  }

  // Embaralha para ficar misturado
  return NextResponse.json({ noticias: todasNoticias.sort(() => Math.random() - 0.5) });
}
