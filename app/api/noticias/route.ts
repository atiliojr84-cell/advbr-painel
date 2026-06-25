import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const FEEDS_RSS = [
  { fonte: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
  { fonte: "OAB", url: "https://www.oab.org.br/rss" },
  { fonte: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
  { fonte: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
  { fonte: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" }
  // ... adicione os outros aqui
];

function extrairDadosDoXml(xmlTexto: string, fonteNome: string) {
  const itens: Array<{texto: string, url: string}> = [];
  // Regex mais abrangente para capturar itens
  const regexBlocos = /<(item|entry)[^>]*>([\s\S]*?)<\/(item|entry)>/g;
  
  let blocoMatch;
  while ((blocoMatch = regexBlocos.exec(xmlTexto)) !== null) {
    const bloco = blocoMatch[2];
    const tituloMatch = /<(?:title|dc:title)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:title|dc:title)>/i.exec(bloco);
    const linkMatch = /<(?:link)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:link)>/i.exec(bloco) || /<guid[^>]*>([\s\S]*?)<\/guid>/i.exec(bloco);
    
    if (tituloMatch) {
      const titulo = tituloMatch[1].replace(/<[^>]*>/g, "").trim();
      if (titulo.length > 10) {
        itens.push({ texto: `[${fonteNome}] ${titulo}`, url: linkMatch ? linkMatch[1].trim() : "#" });
      }
    }
    // Aumentei o limite de 2 para 5 notícias por fonte
    if (itens.length >= 5) break; 
  }
  return itens;
}

export async function GET() {
  try {
    // Para testar agora, comente a linha abaixo para ignorar o cache antigo
    // const cacheNoticias = await kv.get('noticias_juridicas');
    // if (cacheNoticias) return NextResponse.json({ noticias: cacheNoticias });

    const promessas = FEEDS_RSS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        const xml = await res.text();
        return extrairDadosDoXml(xml, feed.fonte);
      } catch { return []; }
    });

    const resultados = await Promise.all(promessas);
    const todasAsNoticias = resultados.flat().sort(() => Math.random() - 0.5); // Randomiza para variar

    await kv.set('noticias_juridicas', todasAsNoticias, { ex: 300 });
    return NextResponse.json({ noticias: todasAsNoticias });
  } catch {
    return NextResponse.json({ noticias: [] }, { status: 500 });
  }
}
