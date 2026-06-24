const FEEDS_RSS = [
  { fonte: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
  { fonte: "CNJ", url: "https://www.cnj.jus.br/feed/" },
  { fonte: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
  { fonte: "JOTA", url: "https://www.jota.info/feed" }
];

function extrairDadosDoXml(xmlTexto, fonteNome) {
  const itens = [];
  const regexBlocos = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const regexTitulo = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i;
  // Regex para pegar o link original da notícia
  const regexLink = /<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i;
  
  let blocoMatch;
  while ((blocoMatch = regexBlocos.exec(xmlTexto)) !== null) {
    const blocoConteudo = blocoMatch[1];
    const tituloMatch = regexTitulo.exec(blocoConteudo);
    const linkMatch = regexLink.exec(blocoConteudo);
    
    if (tituloMatch) {
      let titulo = tituloMatch[1].trim();
      let link = linkMatch ? linkMatch[1].trim() : "#";
      
      titulo = titulo
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

      if (titulo && titulo.length > 25 && !titulo.toLowerCase().startsWith("notícias")) {
        titulo = titulo.replace(/\s+/g, ' ');
        itens.push({
          texto: `[${fonteNome}] ${titulo}`,
          url: link
        });
      }
    }
    if (itens.length >= 6) break; // Pega até 6 de cada portal para ter bastante variedade
  }
  return itens;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const promessas = FEEDS_RSS.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        
        const resposta = await global.fetch(feed.url, { 
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/rss+xml, text/xml, */*'
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
    
    // ALGORITMO DE EMBARALHAMENTO (Intercala as notícias para não saírem juntas do mesmo portal)
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
        { texto: "[STJ] Superior Tribunal de Justiça mantém expediente de plantão ativo.", url: "https://www.stj.jus.br" },
        { texto: "[CNJ] Conselho Nacional de Justiça reforça diretrizes de segurança.", url: "https://www.cnj.jus.br" }
      );
    }

    return res.status(200).json({ noticias: todasAsNoticias });
  } catch (erro) {
    return res.status(500).json({ noticias: [] });
  }
}
