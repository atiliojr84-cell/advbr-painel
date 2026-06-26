import { NextResponse } from 'next/server';

export async function GET() {
  const fontes = [
    { nome: "OAB-PR", url: "https://www.oabpr.org.br/feed/" },
    { nome: "OAB-BR", url: "https://www.oab.org.br/rss" },
    { nome: "CONJUR", url: "https://www.conjur.com.br/rss.xml" }
    { nome: "STJ", url: "https://www.stj.jus.br/sites/portalp/Noticias?format=rss" },
    { nome: "JUSTICA-FOCO", url: "https://www.justicaemfoco.com.br/feed.xml" },
  ];

  const todasNoticias: Array<{texto: string, url: string}> = [];

  for (const fonte of fontes) {
    try {
      const res = await fetch(fonte.url, { 
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      
      const arrayBuffer = await res.arrayBuffer();
      // Decodificador universal para UTF-8 (mais comum e moderno)
      const decoder = new TextDecoder('utf-8');
      let xml = decoder.decode(arrayBuffer);

      // Limpeza de caracteres corrompidos comuns
      xml = xml.replace(/Ã©/g, 'é').replace(/Ã£/g, 'ã').replace(/Ã§/g, 'ç')
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

  return NextResponse.json({ noticias: todasNoticias.sort(() => Math.random() - 0.5) });
}
