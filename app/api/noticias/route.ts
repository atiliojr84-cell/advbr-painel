import { NextResponse } from 'next/server';

export async function GET() {
  const fontes = [
    { nome: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
    { nome: "OAB-BR", url: "https://www.oab.org.br/rss" },
    { nome: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
    { nome: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" },
    { nome: "JUSTICA-FOCO", url: "https://www.justicaemfoco.com.br/feed.xml" },
    { nome: "STJ-NOT", url: "https://res.stj.jus.br/hrestp-c-portalp/RSS.xml" },
    { nome: "STJ-PESQ", url: "https://scon.stj.jus.br/SCON/PesquisaProntaFeed" },
    { nome: "STJ-TESES", url: "https://scon.stj.jus.br/SCON/JurisprudenciaEmTesesFeed" },
    { nome: "STJ-INF", url: "https://processo.stj.jus.br/jurisprudencia/externo/InformativoFeed" }
  ];

  let todasNoticias: Array<{texto: string, url: string}> = [];

  for (const fonte of fontes) {
    try {
      const res = await fetch(fonte.url, { 
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      
      const arrayBuffer = await res.arrayBuffer();
      const xml = new TextDecoder('utf-8').decode(arrayBuffer)
                .replace(/Ã©/g, 'é').replace(/Ã£/g, 'ã').replace(/Ã§/g, 'ç')
                .replace(/Ã³/g, 'ó').replace(/Ãª/g, 'ê').replace(/Ã­/g, 'í')
                .replace(/Ã¡/g, 'á').replace(/Ãµ/g, 'õ');
      
      const regex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>/gi;
      let match;
      let count = 0;
      
      while ((match = regex.exec(xml)) !== null && count < 3) {
        let titulo = match[1].replace(/<!\[CDATA\[|\]\]>|<\/?[^>]+(>|$)/g, "").trim();
        todasNoticias.push({ texto: `[${fonte.nome}] ${titulo}`, url: match[2].trim() });
        count++;
      }
    } catch (e) { continue; }
  }

  // Lógica de "Embaralhamento Furioso"
  // Fisher-Yates Shuffle para garantir que não haja repetição de fonte próxima
  for (let i = todasNoticias.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todasNoticias[i], todasNoticias[j]] = [todasNoticias[j], todasNoticias[i]];
  }

  return NextResponse.json({ noticias: todasNoticias });
}
