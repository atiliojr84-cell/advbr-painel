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
    const dadosStatus = await kv.get('advbr_status_global');

    // --- Nova lógica para buscar e agregar os contadores de relatos ---
    const relatosComunidade = {};
    let cursor = 0;
    do {
      // Busca chaves que começam com 'relatos_contador:'
      const [nextCursor, keys] = await kv.scan(cursor, { match: 'relatos_contador:*', count: 100 });
      cursor = nextCursor;

      for (const key of keys) {
        const parts = key.split(':'); // Ex: ['relatos_contador', 'tjpr_eproc_1g', 'Fora do Ar']
        if (parts.length === 3) {
          const tribunalId = parts[1];
          const problemaTipo = parts[2];
          const count = await kv.get(key); // Pega o valor do contador

          if (count > 0) { // Só adiciona se houver relatos
            if (!relatosComunidade[tribunalId]) {
              relatosComunidade[tribunalId] = {
                total: 0,
                problemas: {},
                ultimoRelato: 'recentemente' // Ou você pode armazenar um timestamp no KV
              };
            }
            relatosComunidade[tribunalId].problemas[problemaTipo] = count;
            relatosComunidade[tribunalId].total += count;
            // Nota: 'ultimoRelato' aqui será uma string genérica.
            // Se precisar de um timestamp real, o api/reportar-problema.js precisaria
            // armazenar um timestamp junto com o contador ou em uma chave separada.
          }
        }
      }
    } while (cursor !== 0);
    // --- Fim da nova lógica ---

    return res.status(200).json({
      status_servidores: dadosStatus || {},
      relatos_comunidade: relatosComunidade
    });
  } catch (error) {
    console.error('Erro no Redis (status-atual.js):', error);
    return res.status(500).json({ erro: 'Erro ao buscar dados do Redis.' });
  }
}
