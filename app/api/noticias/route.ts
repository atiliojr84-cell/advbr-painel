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

  // Dispara todas as requisições simultaneamente (Promise.all)
  const promessas = fontes.map(async (fonte) => {
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
      let noticias: any[] = [];
      
      while ((match = regex.exec(xml)) !== null && count < 3) {
        noticias.push({ texto: `[${fonte.nome}] ${match[1].replace(/<!\[CDATA\[|\]\]>|<\/?[^>]+(>|$)/g, "").trim()}`, url: match[2].trim() });
        count++;
      }
      return noticias;
    } catch { return []; }
  });

  const resultados = await Promise.all(promessas);
  let todasNoticias = resultados.flat();

  // Embaralhamento (Fisher-Yates)
  for (let i = todasNoticias.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todasNoticias[i], todasNoticias[j]] = [todasNoticias[j], todasNoticias[i]];
  }

  return NextResponse.json({ noticias: todasNoticias });
}
