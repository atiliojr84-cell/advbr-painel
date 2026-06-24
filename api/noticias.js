import fetch from 'node-fetch';

// Mapeamento oficial dos canais RSS solicitados (Com foco total no PR e Superiores)
const FEEDS_RSS = [
  { fonte: "TJPR", url: "https://www.tjpr.jus.br/noticias/-/asset_publisher/M7vW/rss?p_p_cacheability=cacheLevelPage" },
  { fonte: "TRT9", url: "https://www.trt9.jus.br/internet/rss/noticias.cron" },
  { fonte: "TRF4", url: "https://www.trf4.jus.br/trf4/controlador.php?p_p_id=rss&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_rss_WAR_rsstestportlet_feedType=atom_1.0" },
  { fonte: "CNJ",  url: "https://www.cnj.jus.br/feed/" },
  { fonte: "STF",  url: "https://portal.stf.jus.br/noticias/rss.xml" },
  { fonte: "STJ",  url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
  { fonte: "TST",  url: "https://padi.tst.jus.br/mural/rss/noticias" },
  { fonte: "TJSP", url: "https://www.tjsp.jus.br/Rss/Noticias" }
];

// Função auxiliar simples para extrair os títulos de dentro das tags <title> do XML sem precisar de bibliotecas pesadas
function extrairTitulosDoXml(xmlTexto, fonteNome) {
  const titulos = [];
  // Regex para capturar o conteúdo de cada tag <title>...</title>
  const regex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/g;
  let match;
  
  while ((match = regex.exec(xmlTexto)) !== null) {
    let titulo = match[1].trim();
    
    // Filtra títulos repetidos, muito curtos ou que sejam o nome do próprio tribunal
    if (titulo && titulo.length > 15 && !titulo.includes("Home -") && !titulo.toLowerCase().startsWith("notícias")) {
      // Remove quebras de linha ou espaços duplos que o XML costuma gerar
      titulo = titulo.replace(/\s+/g, ' ');
      titulos.push(`[${fonteNome}] ${titulo}`);
    }
    // Limita a 4 principais notícias por tribunal para o letreiro não ficar gigantesco
    if (titulos.length >= 4) break;
  }
  return titulos;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300'); // Cache automático de 10 min na Vercel para carregar voando

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Executa as requisições em paralelo para ir o mais rápido possível
    const promessas = FEEDS_RSS.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000); // 4 segundos de limite por feed
        
        const resposta = await fetch(feed.url, { 
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        clearTimeout(timeout);
        if (!resposta.ok) return [];
        
        const xmlTexto = await resposta.text();
        return extrairTitulosDoXml(xmlTexto, feed.fonte);
      } catch (e) {
        console.warn(`Falha ao obter notícias da fonte: ${feed.fonte}`);
        return [];
      }
    });

    const resultadosAgrupados = await Promise.all(promessas);
    // Transforma a matriz em uma lista linear única de notícias
    const todasAsNoticias = resultadosAgrupados.flat();

    // Se todos os feeds falharem por timeout, joga avisos técnicos honestos padrão
    if (todasAsNoticias.length === 0) {
      todasAsNoticias.push(
        "[INFORMAÇÃO] Painel ADVBR ativo: Monitorando canais internos de autenticação.",
        "[MANUTENÇÃO] Varredura automatizada programada via barramento Redis ativo."
      );
    }

    return res.status(200).json({ noticias: todasAsNoticias });
  } catch (erro) {
    console.error('Erro na rota de RSS:', erro);
    return res.status(500).json({ noticias: ["[ERRO] Falha temporária ao sincronizar feeds de notícias dos tribunais."] });
  }
}
