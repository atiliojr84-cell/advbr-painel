// api/reportar-problema.js
import { kv } from '@vercel/kv'; // Usaremos a biblioteca @vercel/kv para simplificar a interação

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  try {
    // Garante que req.body é um objeto, independentemente do Content-Type
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const tribunalId = body.tribunalId || body.tribunal; // Usar tribunalId para consistência
    const problemaTipo = body.problemaTipo || body.description || body.problema; // Usar problemaTipo para consistência
    const observacao = body.observacao || ''; // Campo opcional

    if (!tribunalId || !problemaTipo) {
      return res.status(400).json({
        message: 'Tribunal e tipo de problema são obrigatórios.'
      });
    }

    // --- Lógica para guardar a lista detalhada de relatos (com expiração) ---
    const keyListaRelatos = `relatos_detalhe:${tribunalId}`; // Chave para a lista detalhada
    const TTL_SECONDS = 12 * 60 * 60; // 12 horas em segundos

    let existentes = [];
    try {
        const existingData = await kv.get(keyListaRelatos);
        if (existingData && Array.isArray(existingData)) {
            existentes = existingData;
        }
    } catch (error) {
        console.warn(`Não foi possível recuperar lista existente para ${keyListaRelatos}, iniciando nova.`, error);
    }

    const novoRelato = {
      tribunalId,
      problemaTipo,
      observacao,
      createdAt: new Date().toISOString()
    };

    existentes.unshift(novoRelato); // Adiciona o novo relato no início da lista

    // Salva a lista atualizada e define/reseta a expiração
    await kv.set(keyListaRelatos, existentes, { ex: TTL_SECONDS });

    // --- Lógica para os contadores agregados por tipo de problema (com expiração) ---
    const keyContador = `relatos_contador:${tribunalId}:${problemaTipo}`;
    await kv.incr(keyContador); // Incrementa o contador
    await kv.expire(keyContador, TTL_SECONDS); // Define/reseta a expiração para o contador

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
