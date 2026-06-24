import { createClient } from '@vercel/kv';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import tribunais from './alvos.js';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const PROXY_USER = process.env.PROXY_USER;
const PROXY_PASS = process.env.PROXY_PASS;
const PROXY_HOST = process.env.PROXY_HOST || 'geo.iproyal.com';
const PROXY_PORT = process.env.PROXY_PORT || '12321';

async function testarTribunal(alvo) {
  const controller = new AbortController();
  // Limite de 8 segundos por tribunal para dar tempo de rodar o lote todo na Vercel
  const timeout = setTimeout(() => controller.abort(), 8000); 
  const inicio = Date.now();

  try {
    const proxyUrl = `http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    const resposta = await fetch(alvo.url, {
      agent: proxyAgent,
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const ms = Date.now() - inicio;
    clearTimeout(timeout);

    if (resposta.status >= 200 && resposta.status < 500) {
      return {
        id: alvo.id,
        nome: alvo.nome,
        grupo: alvo.grupo,
        status: ms > 4500 ? 'Lentidão' : 'Online', 
        latenciaMs: ms
      };
    }
    throw new Error(`HTTP ${resposta.status}`);

  } catch (erro) {
    clearTimeout(timeout);
    // SE FALHAR, RETORNA RETORNO HONESTO: Sem milissegundos falsos.
    return {
      id: alvo.id,
      nome: alvo.nome,
      grupo: alvo.grupo,
      status: 'Fora do Ar',
      latenciaMs: null 
    };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const numLote = parseInt(req.query.lote) || 1;
  const alvosDoLote = tribunais.filter(t => t.lote === numLote);

  if (alvosDoLote.length === 0) {
    return res.status(400).json({ erro: `Lote ${numLote} inválido.` });
  }

  try {
    // Busca o estado atual gravado no Redis ou cria um objeto vazio
    let estadoGlobal = {};
    try {
      const dadosCache = await kv.get('advbr_status_global');
      if (dadosCache) {
        // Se a resposta vier como string (comum em algumas versões do SDK), faz o Parse
        estadoGlobal = typeof dadosCache === 'string' ? JSON.parse(dadosCache) : dadosCache;
      }
    } catch (e) {
      console.warn("Aviso: Cache global inacessível, iniciando lote limpo.");
    }

    const resultados = [];
    
    // CORREÇÃO: Executa um por um em fila para não estourar o proxy residencial nem dar timeout na Vercel
    for (const alvo of alvosDoLote) {
      const resultadoAlvo = await testarTribunal(alvo);
      resultados.push(resultadoAlvo);
      
      // Salva imediatamente no objeto global
      estadoGlobal[resultadoAlvo.id] = resultadoAlvo;
    }

    // Salva a atualização consolidada de volta no Redis KV
    await kv.set('advbr_status_global', estadoGlobal); 

    return res.status(200).json({ sucesso: true, lote: numLote, processados: resultados.length });
  } catch (erro) {
    console.error('Erro na rotina de ping:', erro);
    return res.status(500).json({ erro: 'Falha interna na execução da varredura.' });
  }
}
