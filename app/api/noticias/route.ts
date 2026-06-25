import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const FEEDS_RSS = [
  { fonte: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
  { fonte: "OAB", url: "https://www.oab.org.br/rss" },
  { fonte: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
  { fonte: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
  { fonte: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" }
];

export async function GET() {
  try {
    const resultadosTotais: Array<{texto: string, url: string}> = [];

    // Fazemos o fetch de forma sequencial ou paralela com proteção de erro individual
    for (const feed of FEEDS_RSS) {
      try {
        const res = await fetch(feed.url, { next: { revalidate: 60 } });
        if (!res.ok) continue;
        
        const xml = await res.text();
        
        // Regex simplificada e agressiva para extrair títulos e links
        const matches = xml.matchAll(/<(item|entry)>[\s\S]*?<title[^>]*>([\s\S]*?)<\/title>[\s\S]*?<link[^>]*>(?:href=")?([^"<\s]+)(?:"| )/gi);
        
        for (const match of matches) {
          const tituloRaw = match[2].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim();
          const link = match[3] || "#";
          
          if (tituloRaw.length > 10) {
            resultadosTotais.push({ texto: `[${feed.fonte}] ${tituloRaw}`, url: link });
          }
          if (resultadosTotais.length >= 20) break; // Limite global para não travar o frontend
        }
      } catch (e) {
        console.error(`Erro ao buscar ${feed.fonte}:`, e);
      }
    }

    return NextResponse.json({ noticias: resultadosTotais });
  } catch (error) {
    return NextResponse.json({ noticias: [] }, { status: 500 });
  }
}
