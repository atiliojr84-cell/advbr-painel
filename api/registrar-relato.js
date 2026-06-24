import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const { tribunal, tipoProblema } = req.body;
  const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  try {
    // Grava agregado por tribunal — é isso que o modal lê
    let agregados = await kv.get('advbr_relatos_comunidade') || {};
    if (!agregados[tribunal]) {
      agregados[tribunal] = { total: 0, problemas: {}, ultimoRelato: '' };
    }
    agregados[tribunal].total++;
    agregados[tribunal].problemas[tipoProblema] = (agregados[tribunal].problemas[tipoProblema] || 0) + 1;
    agregados[tribunal].ultimoRelato = agora;
    await kv.set('advbr_relatos_comunidade', agregados);

    return res.status(200).json({ sucesso: true });
  } catch (erro) {
    return res.status(500).json({ erro: 'Falha ao gravar relato' });
  }
}
