export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const tribunal = body.tribunal || body.tribunalId;
    const description = body.description || body.problema;

    if (!tribunal || !description) {
      return res.status(400).json({
        message: 'Tribunal e descrição do problema são obrigatórios.'
      });
    }

    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      return res.status(500).json({
        message: 'Variáveis do Upstash não configuradas.'
      });
    }

    const key = `relatos:${tribunal}`;

    // Lê relatos existentes
    let existentes = [];
    const getRes = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (getRes.ok) {
      const getData = await getRes.json();
      if (getData?.result) {
        try {
          existentes = JSON.parse(getData.result);
          if (!Array.isArray(existentes)) existentes = [];
        } catch {
          existentes = [];
        }
      }
    }

    const novoRelato = {
      tribunal,
      description,
      createdAt: new Date().toISOString()
    };

    existentes.unshift(novoRelato);

    const setRes = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(existentes)
    });

    if (!setRes.ok) {
      const texto = await setRes.text();
      return res.status(500).json({
        message: 'Falha ao salvar no Upstash.',
        details: texto
      });
    }

    return res.status(201).json({
      message: 'Relato salvo com sucesso.',
      relato: novoRelato
    });
  } catch (error) {
    console.error('Erro em reportar-problema:', error);
    return res.status(500).json({
      message: 'Erro interno ao salvar o relato.',
      details: String(error?.message || error)
    });
  }
}
