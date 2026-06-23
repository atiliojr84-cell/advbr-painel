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
  // Limite de 12 segundos para dar tempo do proxy residencial responder
  const timeout = setTimeout(() => controller.abort(), 12000); 
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

    // Entrar na tela de login e responder qualquer status HTTP válido (até erro de permissão 403) significa que o servidor está vivo e respondendo!
    if (resposta.status >= 200 && resposta.status < 500) {
      return {
        id: alvo.id,
        nome: alvo.nome,
        grupo: alvo.grupo,
        status: ms > 6500 ? 'Lentidão' : 'Online', // Acima de 6.5 segundos já indica lentidão severa para anexar arquivos
        latenciaMs: ms
      };
    }
    throw new Error(`HTTP ${resposta.status}`);

  } catch (erro) {
    clearTimeout(timeout);
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
    const estadoGlobal = (await kv.get('advbr_status_global')) || {};
    const resultados = await Promise.all(alvosDoLote.map(testarTribunal));

    resultados.forEach(item => { estadoGlobal[item.id] = item; });
    await kv.set('advbr_status_global', estadoGlobal); // Atualiza os dados salvos no cache do Redis

    return res.status(200).json({ sucesso: true, lote: numLote, processados: resultados.length });
  } catch (erro) {
    console.error('Erro na rotina de ping:', erro);
    return res.status(500).json({ erro: 'Falha interna na execução da varredura.' });
  }
}
