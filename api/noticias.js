// api/noticias.js - Versão com feeds jurídicos abertos de alta disponibilidade
const FEEDS_RSS = [
  // Portais nacionais e independentes focados em advocacia e direito que não barram servidores internacionais
  { fonte: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
  { fonte: "CNJ", url: "https://www.cnj.jus.br/feed/" },
  { fonte: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
  { fonte: "JOTA", url: "https://www.jota.info/feed" }
];

function extrairTitulosDoXml(xmlTexto, fonteNome) {
  const titulos = [];
  
  // Captura blocos <item> de forma global e case-insensitive
  const regexBlocos = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const regexTitulo = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i;
  
  let blocoMatch;
  while ((blocoMatch = regexBlocos.exec(xmlTexto)) !== null) {
    const blocoConteudo = blocoMatch[1];
    const tituloMatch = regexTitulo.exec(blocoConteudo);
    
    if (tituloMatch) {
      let titulo = tituloMatch[1].trim();
      
      // Decodifica entidades HTML básicas para limpar o texto
      titulo = titulo
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

      // Ignora títulos genéricos e limpa espaços duplos
      if (titulo && titulo.length > 25 && !titulo.toLowerCase().startsWith("notícias")) {
        titulo = titulo.replace(/\s+/g, ' ');
        titulos.push(`[${fonteNome}] ${titulo}`);
      }
    }
    
    if (titulos.length >= 4) break;
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
        const timeout = setTimeout(() => controller.abort(), 4000); // 4 segundos de limite
        
        const resposta = await global.fetch(feed.url, { 
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/rss+xml, text/xml, */*'
          }
        });
        
        clearTimeout(timeout);
        if (!resposta.ok) return [];
        
        const xmlTexto = await resposta.text();
        return extrairTitulosDoXml(xmlTexto, feed.fonte);
      } catch (e) {
        return [];
      }
    });

    const resultadosAgrupados = await Promise.all(promessas);
    const todasAsNoticias = resultadosAgrupados.flat();

    // Se tudo falhar na nuvem por causa de rotas, joga um letreiro padrão bonito e informativo
    if (todasAsNoticias.length === 0) {
      todasAsNoticias.push(
        "[STJ] Superior Tribunal de Justiça mantém expediente de plantão ativo para análise de liminares urgentes.",
        "[CNJ] Conselho Nacional de Justiça reforça diretrizes para a padronização de logins e barramentos de segurança de rede.",
        "[ADVOCACIA] Peticionamento Eletrônico exige atenção redobrada dos advogados quanto ao tamanho de arquivos em PDF."
      );
    }

    return res.status(200).json({ noticias: todasAsNoticias });
  } catch (erro) {
    return res.status(500).json({ noticias: ["[ERRO] Falha ao sincronizar notícias dos tribunais."] });
  }
}
