// api/status-atual.js
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
    const dados = await kv.get('advbr_status_global');
    let relatos = await kv.get('advbr_relatos_comunidade');

    // Garante que relatos sempre seja um objeto limpo
    if (!relatos || typeof relatos !== 'object' || Array.isArray(relatos)) {
      relatos = {};
    }

    return res.status(200).json({
      status_servidores: dados || {},
      relatos_comunidade: relatos
    });
  } catch (error) {
    console.error('Erro no Redis:', error);
    return res.status(500).json({ erro: 'Erro ao buscar dados do Redis.' });
  }
}
