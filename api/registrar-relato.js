// api/registrar-relato.js
import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  const { tribunalId, tipoProblema } = req.body;

  if (!tribunalId || !tipoProblema) {
    return res.status(400).json({ erro: 'tribunalId e tipoProblema são obrigatórios' });
  }

  const opcoesValidas = ['Offline', 'Instabilidade', 'Falha no Login'];
  if (!opcoesValidas.includes(tipoProblema)) {
    return res.status(400).json({ erro: 'tipoProblema inválido' });
  }

  try {
    const chave = 'advbr_relatos_comunidade';
    let relatos = await kv.get(chave);

    // Garante que sempre seja um objeto, nunca array nem null
    if (!relatos || typeof relatos !== 'object' || Array.isArray(relatos)) {
      relatos = {};
    }

    // Garante que o tribunal existe dentro do objeto
    if (!relatos[tribunalId] || typeof relatos[tribunalId] !== 'object') {
      relatos[tribunalId] = {
        problemas: { 'Offline': 0, 'Instabilidade': 0, 'Falha no Login': 0 },
        total: 0,
        ultimo: null
      };
    }

    // Incrementa o contador
    relatos[tribunalId].problemas[tipoProblema] = (relatos[tribunalId].problemas[tipoProblema] || 0) + 1;
    relatos[tribunalId].total = (relatos[tribunalId].total || 0) + 1;
    relatos[tribunalId].ultimo = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    await kv.set(chave, relatos);

    return res.status(200).json({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao registrar relato:', erro);
    return res.status(500).json({ erro: 'Falha ao registrar relato' });
  }
}
