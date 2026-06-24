import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const dadosStatus = await kv.get('advbr_status_global');
    const relatosBrutos = await kv.get('advbr_relatos') || []; // Lê os relatos brutos

    // Processa os relatos brutos para o formato esperado pelo front-end
    const relatosProcessados = {};
    relatosBrutos.forEach(relato => {
      if (!relatosProcessados[relato.tribunal]) {
        relatosProcessados[relato.tribunal] = {
          total: 0,
          problemas: {},
          ultimoRelato: ''
        };
      }
      relatosProcessados[relato.tribunal].total++;
      relatosProcessados[relato.tribunal].problemas[relato.tipoProblema] =
        (relatosProcessados[relato.tribunal].problemas[relato.tipoProblema] || 0) + 1;
      relatosProcessados[relato.tribunal].ultimoRelato = relato.data; // Atualiza com o mais recente
    });

    return res.status(200).json({
      status_servidores: dadosStatus || {},
      relatos_comunidade: relatosProcessados
    });
  } catch (error) {
    console.error('Erro no Redis (status-atual.js):', error);
    return res.status(500).json({ erro: 'Erro ao buscar dados do Redis.' });
  }
}
