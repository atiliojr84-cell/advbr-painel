import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const FEEDS_RSS = [
  { fonte: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
  { fonte: "OAB", url: "https://www.oab.org.br/rss" },
  { fonte: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
  { fonte: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
  { fonte: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" },
  { fonte: "TRF1", url: "https://portal.trf1.jus.br/portaltrf1/rss.xml" },
  { fonte: "AMBITO", url: "https://ambitojuridico.com.br/feed/" },
  { fonte: "JUSTIÇA", url: "https://justicaemfoco.com.br/rss" },
  { fonte: "IBDFAM", url: "https://ibdfam.org.br/rss/noticias" }
];

function extrairDadosDoXml(xmlTexto: string, fonteNome: string) {
  const itens: Array<{texto: string, url: string}> = [];
  const regexBlocos = /<(item|ITEM)[^>]*>([\s\S]*?)<\/(item|ITEM)>/g;
  const regexTitulo = /<(title|TITLE)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(title|TITLE)>/i;
  const regexLink = /<(link|LINK)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(link|LINK)>/i;
  
  let blocoMatch;
  while ((blocoMatch = regexBlocos.exec(xmlTexto)) !== null) {
    const blocoConteudo = blocoMatch[2];
    const tituloMatch = regexTitulo.exec(blocoConteudo);
    const linkMatch = regexLink.exec(blocoConteudo);
    
    if (tituloMatch) {
      let titulo = tituloMatch[2].trim()
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, ' ');

      if (titulo && titulo.length > 15 && !titulo.toLowerCase().startsWith("notícias")) {
        itens.push({ texto: `[${fonteNome}] ${titulo}`, url: linkMatch ? linkMatch[2].trim() : "#" });
      }
    }
    if (itens.length >= 2) break; 
  }
  return itens;
}

export async function GET() {
  try {
    const cacheNoticias = await kv.get('noticias_juridicas');
    if (cacheNoticias) {
      return NextResponse.json({ noticias: cacheNoticias });
    }

    const promessas = FEEDS_RSS.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(feed.url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) return [];
        const xml = await res.text();
        return extrairDadosDoXml(xml, feed.fonte);
      } catch { return []; }
    });

    const resultados = await Promise.all(promessas);
    const todasAsNoticias = resultados.flat();

    await kv.set('noticias_juridicas', todasAsNoticias, { ex: 300 });
    return NextResponse.json({ noticias: todasAsNoticias });
  } catch {
    return NextResponse.json({ noticias: [] }, { status: 500 });
  }
}
