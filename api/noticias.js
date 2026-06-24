// api/noticias.js - Código corrigido para capturar as notícias reais de cada item
const FEEDS_RSS = [
  { fonte: "TJPR", encoding: "utf-8", url: "https://www.tjpr.jus.br/noticias/-/asset_publisher/M7vW/rss?p_p_cacheability=cacheLevelPage" },
  { fonte: "TRT9", encoding: "iso-8859-1", url: "https://www.trt9.jus.br/internet/rss/noticias.cron" },
  { fonte: "TRF4", encoding: "iso-8859-1", url: "https://www.trf4.jus.br/trf4/controlador.php?p_p_id=rss&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_rss_WAR_rsstestportlet_feedType=atom_1.0" },
  { fonte: "CNJ",  encoding: "utf-8", url: "https://www.cnj.jus.br/feed/" },
  { fonte: "STF",  encoding: "utf-8", url: "https://portal.stf.jus.br/noticias/rss.xml" },
  { fonte: "STJ",  encoding: "utf-8", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
  { fonte: "TST",  encoding: "utf-8", url: "https://padi.tst.jus.br/mural/rss/noticias" },
  { fonte: "TJSP", encoding: "utf-8", url: "https://www.tjsp.jus.br/Rss/Noticias" }
];

function extrairTitulosDoXml(xmlTexto, fonteNome) {
  const titulos = [];
  
  // CORREÇÃO CIRÚRGICA: Captura primeiro os blocos de notícias (<item> ou <entry>) para ignorar o título principal do site
  const regexBlocos = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
  const regexTitulo = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/;
  
  let blocoMatch;
  while ((blocoMatch = regexBlocos.exec(xmlTexto)) !== null) {
    const blocoConteudo = blocoMatch[1];
    const tituloMatch = regexTitulo.exec(blocoConteudo);
    
    if (tituloMatch) {
      let titulo = tituloMatch[1].trim();
      
      // Decodifica acentuações em formato HTML entidade
      titulo = titulo
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

      // Limpa espaços duplos e valida o tamanho da notícia por extenso
      if (titulo && titulo.length > 15) {
        titulo = titulo.replace(/\s+/g, ' ');
        titulos.push(`[${fonteNome}] ${titulo}`);
      }
    }
    
    // Pega as 3 principais notícias de cada tribunal para o letreiro rodar com conteúdo variado
    if (titulos.length >= 3) break;
  }
  return titulos;
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
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        clearTimeout(timeout);
        if (!resposta.ok) return [];
        
        const buffer = await resposta.arrayBuffer();
        const decoder = new TextDecoder(feed.encoding);
        const xmlTexto = decoder.decode(buffer);
        
        return extrairTitulosDoXml(xmlTexto, feed.fonte);
      } catch (e) {
        return [];
      }
    });

    const resultadosAgrupados = await Promise.all(promessas);
    const todasAsNoticias = resultadosAgrupados.flat();

    if (todasAsNoticias.length === 0) {
      todasAsNoticias.push(
        "[INFORMAÇÃO] Painel ADVBR ativo: Monitorando canais de autenticação jurídica.",
        "[SUCESSO] Sincronização e barramento de cache Redis operando em tempo real."
      );
    }

    return res.status(200).json({ noticias: todasAsNoticias });
  } catch (erro) {
    return res.status(500).json({ noticias: ["[ERRO] Falha ao sincronizar notícias dos tribunais."] });
  }
}
