import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  // Permite que o seu frontend consulte a API sem bloqueio de segurança
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const dados = await kv.get('advbr_status_global');
    // Busca também os relatos dos advogados se existirem no Redis
    const relatos = await kv.get('advbr_relatos_comunidade') || {};

    return res.status(200).json({
      status_servidores: dados || {},
      relatos_comunidade: relatos
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar dados do Redis.' });
  }
}
