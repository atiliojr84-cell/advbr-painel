import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { tribunal, tipoProblema } = req.body;

  if (!tribunal || !tipoProblema) {
    return res.status(400).json({ erro: 'Dados incompletos para o relato.' });
  }

  const novoRelato = {
    tribunal,
    tipoProblema,
    data: new Date().toISOString(), // Usar ISO string para padronizar e facilitar ordenação
    timestamp: Date.now() // Adicionar timestamp para ordenação e TTL
  };

  try {
    // Busca os relatos atuais no Redis
    // A chave 'advbr_relatos' vai guardar uma lista de todos os relatos brutos
    let relatosAtuais = await kv.get('advbr_relatos') || [];

    // Adiciona o novo relato no início da lista
    relatosAtuais.unshift(novoRelato);

    // Limita a lista para não crescer indefinidamente (ex: últimos 100 relatos)
    relatosAtuais = relatosAtuais.slice(0, 100);

    // Salva a lista atualizada no Redis com um TTL (ex: 24 horas = 86400 segundos)
    // Isso garante que relatos muito antigos sejam automaticamente removidos
    await kv.set('advbr_relatos', relatosAtuais, { ex: 86400 });

    return res.status(200).json({ sucesso: true, mensagem: 'Relato gravado com sucesso.' });
  } catch (erro) {
    console.error('Erro ao gravar relato no Redis:', erro);
    return res.status(500).json({ erro: 'Falha ao gravar relato.' });
  }
}
