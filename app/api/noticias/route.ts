import { NextResponse } from 'next/server';

export async function GET() {
  const fontes = [
    { nome: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
    { nome: "OAB-BR", url: "https://www.oab.org.br/rss" },
    { nome: "CONJUR", url: "https://www.conjur.com.br/rss.xml" },
    { nome: "MIGALHAS", url: "https://www.migalhas.com.br/arquivos/rss/rss_migalhas.xml" },
    { nome: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
    { nome: "JUSTICA-FOCO", url: "https://www.justicaemfoco.com.br/feed" },
    { nome: "TRF4", url: "https://www.trf4.jus.br/trf4/noticias.xml" },
    { nome: "HP-JURIDICA", url: "https://www.homepagejuridica.net/feed/" },
    { nome: "TRT7", url: "https://www.trt7.jus.br/index.php?option=com_content&view=category&id=152&Itemid=887&format=feed&type=rss" }
  ];

  const colecoes = [];

  for (const fonte of fontes) {
    try {
      const res = await fetch(fonte.url, { 
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      
      if (!res.ok) continue;
      const xml = await res.text();
      
      const regex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>/gi;
      let match;
      let count = 0;
      const noticiasDaFonte = [];
      
      while ((match = regex.exec(xml)) !== null && count < 5) {
        const titulo = match[1].replace(/<!\[CDATA\[|\]\]>|<\/?[^>]+(>|$)/g, "").trim();
        noticiasDaFonte.push({ texto: `[${fonte.nome}] ${titulo}`, url: match[2].trim() });
        count++;
      }
      
      if (noticiasDaFonte.length > 0) colecoes.push(noticiasDaFonte);
    } catch (e) { continue; }
  }

  const todasNoticias = [];
  const maxNoticias = Math.max(...colecoes.map(c => c.length));

  for (let i = 0; i < maxNoticias; i++) {
    for (const colecao of colecoes) {
      if (colecao[i]) todasNoticias.push(colecao[i]);
    }
  }

  return NextResponse.json({ noticias: todasNoticias });
}
