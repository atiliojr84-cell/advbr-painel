// CORREÇÃO: Trocado de 'import' para 'require' para matar o erro de SyntaxError
const { createClient } = require('@vercel/kv');

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// CORREÇÃO: Trocado de 'export default' para 'module.exports'
module.exports = async function handler(req, res) {
  // Mantém exatamente os seus cabeçalhos originais de segurança e cache
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const dados = await kv.get('advbr_status_global');
    // Busca também os relatos dos advogados se existirem no Redis
    const relatos = await kv.get('advbr_relatos_comunidade') || {};

    // Mantém o mesmo padrão de resposta que seu index.html precisa ler
    return res.status(200).json({
      status_servidores: dados || {},
      relatos_comunidade: relatos
    });
  } catch (error) {
    console.error('Erro ao buscar dados do Redis:', error);
    return res.status(500).json({ erro: 'Erro ao buscar dados do Redis.' });
  }
};
