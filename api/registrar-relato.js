// api/registrar-relatos.js
const fetch = require('node-fetch'); // se der erro de módulo, depois dá pra trocar por global fetch

async function salvarRelatoNoRedis(relato) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('KV_REST_API_URL ou KV_REST_API_TOKEN não configurados nas variáveis de ambiente.');
  }

  const key = `relatos:${relato.tribunal}`; // ex: relatos:TJPR

  // 1. ler relatos existentes
  let existentes = [];
  try {
    const getRes = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (getRes.ok) {
      const data = await getRes.json();
      if (data && data.result) {
        existentes = JSON.parse(data.result);
        if (!Array.isArray(existentes)) existentes = [];
      }
    }
  } catch (e) {
    console.warn('Não consegui ler relatos existentes, começando lista vazia.', e);
  }

  // 2. adicionar o novo relato no início
  existentes.unshift(relato);

  // 3. limitar aos últimos 20
  existentes = existentes.slice(0, 20);

  // 4. salvar de volta
  const setRes = await fetch(`${url}/set`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      value: JSON.stringify(existentes),
      // ex: 7 dias de validade (opcional)
      ex: 60 * 60 * 24 * 7,
    }),
  });

  if (!setRes.ok) {
    const text = await setRes.text();
    throw new Error(`Erro ao salvar no Upstash: ${text}`);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const tribunal = String(body?.tribunal || '').trim();
    const description = String(body?.description || '').trim();

    if (!tribunal || !description) {
      return res.status(400).json({ message: 'Tribunal e descrição são obrigatórios.' });
    }

    const relato = {
      tribunal,
      description,
      createdAt: new Date().toISOString(),
    };

    await salvarRelatoNoRedis(relato);

    return res.status(201).json({ message: 'Relato salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar relato:', error);
    return res.status(500).json({ message: 'Erro interno ao registrar relato.' });
  }
};
