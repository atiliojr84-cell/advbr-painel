// api/noticias.js - Versão Otimizada com Maior Tolerância de Timeout para o Plano PRO
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

      if (titulo && titulo.length > 20 && !titulo.toLowerCase().startsWith("notícias") && !titulo.toLowerCase().includes("vaga")) {
        titulo = titulo.replace(/\s+/g, ' ');
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
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=150'); // Cache mais curto para atualizar rápido

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const promessas = FEEDS_RSS.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // Aumentado para 8 segundos (evita quedas por lentidão)
        
        const resposta = await global.fetch(feed.url, { 
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, text/xml, application/xml, */*',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
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

    // Se tudo falhar, o plano de fundo entra em ação com as principais marcas
    if (todasAsNoticias.length === 0) {
      todasAsNoticias.push(
        { texto: "[OAB-PR] Ordem dos Advogados do Brasil Seção Paraná ativa no monitoramento de prazos.", url: "https://www.oabpr.org.br" },
        { texto: "[MIGALHAS] Informativo de direito e atualizações de jurisprudência em tempo real.", url: "https://www.migalhas.com.br" },
        { texto: "[STJ] Superior Tribunal de Justiça - Painel de monitoramento operacional ativo.", url: "https://www.stj.jus.br" }
      );
    }

    return res.status(200).json({ noticias: todasAsNoticias });
  } catch (erro) {
    return res.status(500).json({ noticias: [] });
  }
}
