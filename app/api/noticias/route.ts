import { NextResponse } from 'next/server';

export async function GET() {
  const FEEDS = [
    { nome: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
    { nome: "CONJUR", url: "https://www.conjur.com.br/rss.xml" }
  ];

  try {
    const noticias: Array<{texto: string, url: string}> = [];
    
    for (const feed of FEEDS) {
      try {
        const response = await fetch(feed.url, { next: { revalidate: 60 } });
        if (!response.ok) continue;
        const xml = await response.text();
        
        // Regex simplificada que funciona em qualquer ambiente
        const regex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>/gi;
        let match;
        
        while ((match = regex.exec(xml)) !== null) {
          const titulo = match[1].replace(/<!\[CDATA\[|\]\]>|<\/?[^>]+(>|$)/g, "").trim();
          noticias.push({ texto: `[${feed.nome}] ${titulo}`, url: match[2].trim() });
          if (noticias.length >= 10) break;
        }
      } catch (e) { continue; }
    }
    
    return NextResponse.json({ noticias });
  } catch (error) {
    return NextResponse.json({ noticias: [] });
  }
}
