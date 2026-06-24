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
    let status = await kv.get('advbr_status_global');
    let relatos = await kv.get('advbr_relatos');

    // Se vier string, tenta fazer parse
    if (typeof status === 'string') {
      try { status = JSON.parse(status); } catch { status = {}; }
    }
    if (!status || typeof status !== 'object') status = {};

    // Relatos: garante array
    if (!Array.isArray(relatos)) relatos = [];

    return res.status(200).json({
      status_servidores: status,
      relatos_comunidade: relatos
    });
  } catch (error) {
    console.error('Erro no Redis em /api/status-atual:', error);
    // Mesmo com erro, responder algo para o front não quebrar
    return res.status(200).json({
      status_servidores: {},
      relatos_comunidade: []
    });
  }
}
