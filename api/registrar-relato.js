import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tribunal, tipoProblema } = req.body;
  const novoRelato = {
    tribunal,
    tipoProblema,
    data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  try {
    // Busca os relatos atuais no Redis (limita a 5 para não encher a tela)
    let relatos = await kv.get('advbr_relatos') || [];
    relatos.unshift(novoRelato); // Coloca o novo no topo
    relatos = relatos.slice(0, 5); 

    await kv.set('advbr_relatos', relatos);
    return res.status(200).json({ sucesso: true });
  } catch (erro) {
    return res.status(500).json({ erro: 'Falha ao gravar voto' });
  }
}
