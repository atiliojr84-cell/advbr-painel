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

    for (const feed of FEEDS_RSS) {
      try {
        const res = await fetch(feed.url, { next: { revalidate: 60 } });
        if (!res.ok) continue;
        
        const xml = await res.text();
        
        // Regex corrigida para rodar em qualquer ambiente sem erro de compilação
        const regex = /<(item|entry)>[\s\S]*?<title[^>]*>([\s\S]*?)<\/title>[\s\S]*?<link[^>]*>(?:href=")?([^"<\s]+)(?:"| )/gi;
        
        let match;
        // Usamos .exec() que é o padrão clássico e não falha na build
        while ((match = regex.exec(xml)) !== null) {
          const tituloRaw = match[2].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim();
          const link = match[3] || "#";
          
          if (tituloRaw.length > 10) {
            resultadosTotais.push({ texto: `[${feed.fonte}] ${tituloRaw}`, url: link });
          }
          if (resultadosTotais.length >= 20) break;
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
