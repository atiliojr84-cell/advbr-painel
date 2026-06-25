// api/listar-relatos.js

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const tribunal = req.query.tribunal;
  if (!tribunal) {
    return res.status(400).json({ message: 'Parâmetro tribunal é obrigatório.' });
  }

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      return res.status(500).json({
        message: 'KV_REST_API_URL ou KV_REST_API_TOKEN não configurados.'
      });
    }

    const key = `relatos:${tribunal}`;

    const getRes = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!getRes.ok) {
      return res.status(200).json([]);
    }

    const data = await getRes.json();
    if (!data || !data.result) {
      return res.status(200).json([]);
    }

    let relatos = [];
    try {
      relatos = JSON.parse(data.result);
    } catch {
      relatos = [];
    }

    const agora = Date.now();
    const TTL_MS = 12 * 60 * 60 * 1000; // 12 horas
    const limite = agora - TTL_MS;

    relatos = relatos.filter(r => (r.createdAt || 0) >= limite);

    return res.status(200).json(relatos);
  } catch (error) {
    console.error('Erro em listar-relatos:', error);
    return res.status(500).json({ message: 'Erro ao listar relatos.' });
  }
}
