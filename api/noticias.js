// api/noticias.js - Versão PRO com Extrator Universal Insensível a Maiúsculas/Minúsculas
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

function extrairDadosDoXml(xmlTexto, fonteNome) {
  const itens = [];
  
  // Regex universal que aceita <item> ou <ITEM>, <title> ou <TITLE>, etc.
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
      
      // Limpeza profunda de HTML e entidades de texto
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
        itens.push({
          texto: `[${fonteNome}] ${titulo}`,
          url: link
        });
      }
    }
    if (itens.length >= 4) break;
  }
  return itens;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30'); // Atualização rápida para teste

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const promessas = FEEDS_RSS.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); 
        
        const resposta = await global.fetch(feed.url, { 
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*'
          }
        });
        
        clearTimeout(timeout);
        if (!resposta.ok) return [];
        
        const xmlTexto = await resposta.text();
        return extrairDadosDoXml(xmlTexto, feed.fonte);
      } catch (e) {
        return [];
      }
    });

    const resultadosAgrupados = await Promise.all(promessas);
    const todasAsNoticias = [];
    let maxItens = Math.max(...resultadosAgrupados.map(lista => lista.length));
    
    for (let i = 0; i < maxItens; i++) {
      resultadosAgrupados.forEach(lista => {
        if (lista[i]) {
          todasAsNoticias.push(lista[i]);
        }
      });
    }

    if (todasAsNoticias.length === 0) {
      todasAsNoticias.push(
        { texto: "[OAB-PR] Sistema de contingência do barramento ativo.", url: "https://www.oabpr.org.br" },
        { texto: "[MIGALHAS] Informativo jurídico online e atualizações em tempo real.", url: "https://www.migalhas.com.br" }
      );
    }

    return res.status(200).json({ noticias: todasAsNoticias });
  } catch (erro) {
    return res.status(500).json({ noticias: [] });
  }
}
