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
    return res.status(400).json({ erro: 'Tribunal e tipoProblema são obrigatórios.' });
  }

  const novoRelato = {
    tribunal,
    tipoProblema,
    data: new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
  };

  try {
    // Busca os relatos atuais no Redis
    let relatos = await kv.get('advbr_relatos') || [];
    relatos.unshift(novoRelato); // Adiciona o novo relato no início

    // Opcional: Limitar o número de relatos brutos para não sobrecarregar o KV
    // Por exemplo, manter apenas os últimos 100 relatos
    relatos = relatos.slice(0, 100);

    await kv.set('advbr_relatos', relatos);
    return res.status(200).json({ sucesso: true, mensagem: 'Relato gravado com sucesso.' });
  } catch (erro) {
    console.error('Erro ao gravar relato no Redis (registrar-relato.js):', erro);
    return res.status(500).json({ erro: 'Falha ao gravar relato.' });
  }
}
