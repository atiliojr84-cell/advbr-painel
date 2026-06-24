// api/monitor.js
import { createClient } from '@vercel/kv';
import tribunais from './alvos.js';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const proxyUrl = process.env.PROXY_URL || null;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null;

async function testarTribunal(alvo) {
  const inicio = Date.now();
  let status = 'Fora do Ar';
  let latenciaMs = null;

  try {
    const resposta = await fetch(alvo.url, {
      method: 'GET',
      redirect: 'follow',
      agent: agent || undefined,
      timeout: 15000
    });

    latenciaMs = Date.now() - inicio;

    if (resposta.ok) {
      status = 'Online';
    } else if (resposta.status >= 500) {
      status = 'Fora do Ar';
    } else {
      status = 'Lentidão';
    }
  } catch (erro) {
    latenciaMs = Date.now() - inicio;
    status = 'Fora do Ar';
  }

  return {
    id: alvo.id,
    status,
    latenciaMs,
    atualizadoEm: new Date().toISOString()
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { lote } = req.query;
  const numLote = parseInt(lote, 10);

  if (isNaN(numLote) || numLote < 1 || numLote > 10) {
    return res.status(400).json({ erro: 'Lote inválido. Use 1 a 10.' });
  }

  try {
    const alvosDoLote = tribunais.filter(t => t.lote === numLote);

    let estadoGlobal = {};
    try {
      const dadosCache = await kv.get('advbr_status_global');
      if (dadosCache) {
        estadoGlobal = typeof dadosCache === 'string' ? JSON.parse(dadosCache) : dadosCache;
      }
    } catch {
      estadoGlobal = {};
    }

    const resultados = [];
    for (const alvo of alvosDoLote) {
      const r = await testarTribunal(alvo);
      resultados.push(r);
      estadoGlobal[r.id] = r;
    }

    await kv.set('advbr_status_global', estadoGlobal, { ex: 10800 }); // 3h de TTL

    return res.status(200).json({ sucesso: true, lote: numLote, processados: resultados.length });
  } catch (erro) {
    console.error('Erro na rotina de ping:', erro);
    return res.status(500).json({ erro: 'Falha interna na execução da varredura.' });
  }
}
