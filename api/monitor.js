import { createClient } from '@vercel/kv';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Conexão com o banco de dados Vercel KV
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// ==========================================
// 🛡️ MÁSCARA RESIDENCIAL BRASILEIRA (IPRoyal)
// ==========================================
const PROXY_USER = 'XwmW5VQbmJG32t3r'; 
const PROXY_PASS = 'gB3IGVddAS3pSAaa_country-br';
const PROXY_HOST = 'geo.iproyal.com';
const PROXY_PORT = '12321';

// Cria o túnel seguro passando pelo proxy residencial do Brasil
const proxyUrl = `http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}`;
const proxyAgent = new HttpsProxyAgent(proxyUrl);

// Lista de Tribunais (Lembre-se de manter a sua lista completa aqui)
const tribunais = [
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://pje.jus.br/pje/login.seam", grupo: "nacionais", lote: 1 },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais", lote: 1 },
    { id: "stf", nome: "STF - Eletrônico", url: "https://autenticacao.stf.jus.br/pki/login", grupo: "nacionais", lote: 1 },
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/eproc_2g/externo_controlador.php?acao=principal", grupo: "PR", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/login", grupo: "PR", lote: 1 },
    { id: "tjsp_saj", nome: "TJSP - SAJ", url: "https://esaj.tjsp.jus.br/sajps/login.do", grupo: "SP", lote: 1 },
    { id: "tjac_pje", nome: "TJAC - PJe", url: "https://pje.tjac.jus.br/pje/ConsultaPublica/listView.seam", grupo: "AC", lote: 4 },
    // ⚠️ COMPLETE AQUI: Insira o resto de todos os seus tribunais (Lotes 1, 2, 3 e 4) exatamente como estavam antes.
];

async function testarTribunalComProxy(alvo) {
    const inicio = Date.now();
    try {
        // O robô faz a requisição passando por dentro do IP Residencial
        const resposta = await fetch(alvo.url, {
            agent: proxyAgent,
            method: 'GET',
            timeout: 10000, // Limite de 10 segundos por tribunal
            headers: {
                // Simulamos um navegador Chrome real no Windows
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        const tempoDecorrido = Date.now() - inicio;

        // Se o firewall deixar passar, teremos uma resposta válida (status na faixa de 200 ou 300, ou até 404/500 do sistema, mas não bloqueio de rede)
        if (resposta.status >= 200 && resposta.status < 400) {
            return {
                id: alvo.id,
                nome: alvo.nome,
                grupo: alvo.grupo,
                status: tempoDecorrido > 4000 ? "Lentidão" : "Online",
                latenciaMs: tempoDecorrido
            };
        } else {
            throw new Error(`Status HTTP ${resposta.status}`);
        }

    } catch (erro) {
        return {
            id: alvo.id,
            nome: alvo.nome,
            grupo: alvo.grupo,
            status: "Fora do Ar",
            latenciaMs: null
        };
    }
}

export default async function handler(req, res) {
    // Permite que o seu painel frontend acesse a API sem problemas de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { lote } = req.query;
    const numLote = parseInt(lote) || 1;
    const alvosDoLote = tribunais.filter(t => t.lote === numLote);

    if (alvosDoLote.length === 0) {
        return res.status(400).json({ erro: `Nenhum tribunal configurado para o lote ${numLote}.` });
    }

    try {
        let estadoGlobal = (await kv.get('advbr_status_global')) || {};
        
        // Executa os testes do lote em paralelo usando o agente de proxy
        const promessas = alvosDoLote.map(alvo => testarTribunalComProxy(alvo));
        const resultados = await Promise.all(promessas);

        // Atualiza apenas os tribunais que foram testados neste lote
        resultados.forEach(item => {
            estadoGlobal[item.id] = item;
        });

        // Grava de volta no Vercel KV
        await kv.set('advbr_status_global', estadoGlobal);

        return res.status(200).json({ 
            sucesso: true, 
            mensagem: `Lote ${numLote} testado via Proxy Residencial do Brasil.`,
            itens_processados: resultados.length 
        });
    } catch (erro) {
        console.error("Erro interno no monitor:", erro);
        return res.status(500).json({ erro: "Falha na execução do lote ou banco de dados." });
    }
}
