import { createClient } from '@vercel/kv';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Conexão com o banco de dados Vercel KV
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const PROXY_USER = 'XwmW5VQbmJG32t3r'; 
const PROXY_PASS = 'gB3IGVddAS3pSAaa_country-br';
const PROXY_HOST = 'geo.iproyal.com';
const PROXY_PORT = '12321';

const proxyUrl = `http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}`;
const proxyAgent = new HttpsProxyAgent(proxyUrl);

// =========================================================================
// 🏛️ MOTOR FOCADO: Apenas os 10 principais + Paraná + Nacionais + Superiores
// =========================================================================
const tribunais = [
    // LOTE 1: Os 10 principais (Exibidos no seu carrossel e botões)
    { id: "pje_cnj", nome: "PJe - Nacional", url: "https://pje.jus.br/pje/login.seam", grupo: "coletivos", lote: 1 },
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/eproc_2g/externo_controlador.php?acao=principal", grupo: "PR", lote: 1 },
    { id: "tjsp_saj", nome: "TJSP - e-SAJ", url: "https://esaj.tjsp.jus.br/sajps/login.do", grupo: "nacionais", lote: 1 },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais", lote: 1 },
    { id: "stf", nome: "STF - Eletrônico", url: "https://autenticacao.stf.jus.br/pki/login", grupo: "nacionais", lote: 1 },
    { id: "trt9_1g", nome: "TRT9 - 1º Grau", url: "https://pje.trt9.jus.br/pje/login.seam", grupo: "PR", lote: 1 },
    { id: "trt9_2g", nome: "TRT9 - 2º Grau", url: "https://pje.trt9.jus.br/pje2g/login.seam", grupo: "PR", lote: 1 },
    { id: "trf3", nome: "TRF3 - PJe", url: "https://pje1g.trf3.jus.br/pje/ConsultaPublica/listView.seam", grupo: "nacionais", lote: 1 },
    { id: "trt2_1g", nome: "TRT2 - PJe", url: "https://pje.trtsp.jus.br/pje/login.seam", grupo: "nacionais", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/login", grupo: "PR", lote: 1 }
];

async function testarTribunalComProxy(alvo) {
    const inicio = Date.now();
    try {
        const resposta = await fetch(alvo.url, {
            agent: proxyAgent,
            method: 'GET',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const tempoDecorrido = Date.now() - inicio;
        if (resposta.status >= 200 && resposta.status < 400) {
            return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: tempoDecorrido > 5000 ? "Lentidão" : "Online", latenciaMs: tempoDecorrido };
        } else {
            throw new Error(`HTTP ${resposta.status}`);
        }
    } catch (erro) {
        return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: "Fora do Ar", latenciaMs: null };
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { lote } = req.query;
    const numLote = parseInt(lote) || 1;
    const alvosDoLote = tribunais.filter(t => t.lote === numLote);

    try {
        let estadoGlobal = (await kv.get('advbr_status_global')) || {};
        const resultados = await Promise.all(alvosDoLote.map(alvo => testarTribunalComProxy(alvo)));
        resultados.forEach(item => estadoGlobal[item.id] = item);
        await kv.set('advbr_status_global', estadoGlobal);
        return res.status(200).json({ sucesso: true, itens: resultados.length });
    } catch (erro) {
        return res.status(500).json({ erro: "Erro ao atualizar." });
    }
}
