import { NextResponse } from 'next/server';

export async function GET() {
  // Lista expandida com fontes de alta relevância para advogados
  const fontes = [
    { nome: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
    { nome: "OAB-BR", url: "https://www.oab.org.br/rss" },
    { nome: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
    { nome: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" },
    { nome: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
    { nome: "JOTA", url: "https://www.jota.info/feed" },
    { nome: "DIR-NEWS", url: "https://www.direitonews.com.br/feed" }
  ];

  const colecoes = [];

  for (const fonte of fontes) {
    try {
      // Adicionamos um User-Agent para garantir que os sites não bloqueiem a requisição
      const res = await fetch(fonte.url, { 
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      
      if (!res.ok) continue;
      const xml = await res.text();
      
      const regex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>/gi;
      let match;
      let count = 0;
      const noticiasDaFonte = [];
      
      while ((match = regex.exec(xml)) !== null && count < 5) {
        const titulo = match[1].replace(/<!\[CDATA\[|\]\]>|<\/?[^>]+(>|$)/g, "").trim();
        noticiasDaFonte.push({ texto: `[${fonte.nome}] ${titulo}`, url: match[2].trim() });
        count++;
      }
      
      if (noticiasDaFonte.length > 0) colecoes.push(noticiasDaFonte);
    } catch (e) { continue; }
  }

  // Lógica de distribuição (Round-Robin)
  const todasNoticias = [];
  const maxNoticias = Math.max(...colecoes.map(c => c.length));

  for (let i = 0; i < maxNoticias; i++) {
    for (const colecao of colecoes) {
      if (colecao[i]) todasNoticias.push(colecao[i]);
    }
  }

  return NextResponse.json({ noticias: todasNoticias });
}
