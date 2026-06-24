// api/noticias.js - Versão com OAB Nacional no lugar do JOTA (Sem política partidária)
const FEEDS_RSS = [
  { fonte: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },         // Advocacia do Paraná
  { fonte: "OAB",    url: "https://www.oab.org.br/rss" },             // Conselho Federal da OAB Nacional
  { fonte: "STJ",    url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" }, // Superior Tribunal de Justiça
  { fonte: "CONJUR", url: "https://www.conjur.com.br/rss.xml" }       // Consultor Jurídico
];

function extrairDadosDoXml(xmlTexto, fonteNome) {
  const itens = [];
  const regexBlocos = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const regexTitulo = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i;
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

      // Filtro rigoroso: ignora títulos genéricos e limpa espaços duplos
      if (titulo && titulo.length > 20 && !titulo.toLowerCase().startsWith("notícias")) {
        titulo = titulo.replace(/\s+/g, ' ');
        itens.push({
          texto: `[${fonteNome}] ${titulo}`,
          url: link
        });
      }
    }
    if (itens.length >= 5) break; // Limite de 5 notícias por portal para manter o rodízio saudável
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
    
    // Algoritmo de intercalação Round-Robin para misturar os portais de forma alternada
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
        { texto: "[OAB-PR] Ordem dos Advogados do Brasil Seção Paraná ativa no monitoramento de prazos.", url: "https://www.oabpr.org.br" },
        { texto: "[OAB] Conselho Federal da OAB Nacional acompanha o andamento das pautas da advocacia.", url: "https://www.oab.org.br" },
        { texto: "[STJ] Superior Tribunal de Justiça mantém barramento de monitoramento de instabilidades ativo.", url: "https://www.stj.jus.br" }
      );
    }

    return res.status(200).json({ noticias: todasAsNoticias });
  } catch (erro) {
    return res.status(500).json({ noticias: [] });
  }
}
