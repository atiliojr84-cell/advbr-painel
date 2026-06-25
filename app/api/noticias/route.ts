import { NextResponse } from 'next/server';

// Revalida o cache dessa rota a cada 5 minutos (300 segundos) para não sobrecarregar os portais
export const revalidate = 300; 

const FEEDS_RSS = [
  { fonte: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },         
  { fonte: "OAB",    url: "https://www.oab.org.br/rss" },             
  { fonte: "STJ",    url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" }, 
  { fonte: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
  { fonte: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" },
  { fonte: "TRF1",   url: "https://portal.trf1.jus.br/portaltrf1/rss.xml" },
  { fonte: "AMBITO", url: "https://ambitojuridico.com.br/feed/" },
  { fonte: "JUSTIÇA", url: "https://justicaemfoco.com.br/rss" },
  { fonte: "IBDFAM", url: "https://ibdfam.org.br/rss/noticias" }
];

function extrairDadosDoXml(xmlTexto: string, fonteNome: string) {
  const itens = [];
  const regexBlocos = /<(item|ITEM)[^>]*>([\s\S]*?)<\/(item|ITEM)>/g;
  const regexTitulo = /<(title|TITLE)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(title|TITLE)>/i;
  const regexLink = /<(link|LINK)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(link|LINK)>/i;
  
  let blocoMatch;
  while ((blocoMatch = regexBlocos.exec(xmlTexto)) !== null) {
    const blocoConteudo = blocoMatch[2];
    const tituloMatch = regexTitulo.exec(blocoConteudo);
    const linkMatch = regexLink.exec(blocoConteudo);
    
    if (tituloMatch) {
      let titulo = tituloMatch[2].trim();
      let link = linkMatch ? linkMatch[2].trim() : "#";
      
      titulo = titulo
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

      if (titulo && titulo.length > 15 && !titulo.toLowerCase().startsWith("notícias")) {
        itens.push({ texto: `[${fonteNome}] ${titulo}`, url: link });
      }
    }
    if (itens.length >= 4) break;
  }
  return itens;
}

export async function GET() {
  try {
    const promessas = FEEDS_RSS.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); 
        
        const resposta = await fetch(feed.url, { 
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*'
          }
        });
        
        clearTimeout(timeout);
        if (!resposta.ok) return [];
        
        // CORREÇÃO: Adicionado o "resposta." que estava faltando
        const xmlTexto = await resposta.text();
        return extrairDadosDoXml(xmlTexto, feed.fonte);
      } catch (e) {
        return [];
      }
    });

    const resultadosAgrupados = await Promise.all(promessas);
    const todasAsNoticias: Array<{texto: string, url: string}> = [];
    let maxItens = Math.max(...resultadosAgrupados.map(lista => lista.length));
    
    for (let i = 0; i < maxItens; i++) {
      resultadosAgrupados.forEach(lista => {
        if (lista[i]) todasAsNoticias.push(lista[i]);
      });
    }

    if (todasAsNoticias.length === 0) {
      todasAsNoticias.push(
        { texto: "[ADVBR] Sistema de contingência do barramento ativo.", url: "#" },
        { texto: "[MIGALHAS] Informativo jurídico online e atualizações em tempo real.", url: "https://www.migalhas.com.br" }
      );
    }

    return NextResponse.json({ noticias: todasAsNoticias });
  } catch (erro) {
    return NextResponse.json({ noticias: [] }, { status: 500 });
  }
}
