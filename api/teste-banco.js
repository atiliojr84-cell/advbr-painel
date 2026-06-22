import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
    try {
        // Tenta gravar uma chave temporária no Upstash Redis
        await kv.set('teste_infra_junior', 'Conexão 100% Estabelecida!');
        
        // Tenta ler o dado de volta imediatamente
        const valorRetornado = await kv.get('teste_infra_junior');
        
        return res.status(200).json({ 
            comunicacao_vercel_upstash: "Sucesso!", 
            mensagem_do_banco: valorRetornado 
        });
    } catch (erro) {
        return res.status(500).json({ 
            comunicacao_vercel_upstash: "Falhou", 
            causa_do_erro: erro.message 
        });
    }
}
