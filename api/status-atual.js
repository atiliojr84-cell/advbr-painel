import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    try {
        const dados = await kv.get('advbr_status_global');
        return res.status(200).json(dados || {});
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar do Redis." });
    }
}
