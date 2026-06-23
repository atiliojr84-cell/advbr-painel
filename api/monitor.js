import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const tribunais = [
    // LOTE 1 (17 Tribunais) - Nacionais, Sul, Sudeste e Centro-Oeste (Parte 1)
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://www.pje.jus.br/navegador/", grupo: "nacionais", lote: 1 },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais", lote: 1 },
    { id: "stf", nome: "STF - Eletrônico", url: "https://portal.stf.jus.br/", grupo: "nacionais", lote: 1 },
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/eproc_2g/", grupo: "PR", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/", grupo: "PR", lote: 1 },
    { id: "trt9_1g", nome: "TRT9 (PR) - 1º Grau", url: "https://pje.trt9.jus.br/pje/pje-presente.html", grupo: "PR", lote: 1 },
    { id: "trt9_2g", nome: "TRT9 (PR) - 2º Grau", url: "https://pje.trt9.jus.br/pje2g/pje-presente.html", grupo: "PR", lote: 1 },
    { id: "tjsp_saj", nome: "TJSP - SAJ", url: "https://esaj.tjsp.jus.br/", grupo: "SP", lote: 1 },
    { id: "trt2_1g", nome: "TRT2 (SP) - 1º Grau", url: "https://pje.trtsp.jus.br/pje/pje-presente.html", grupo: "SP", lote: 1 },
    { id: "trt2_2g", nome: "TRT2 (SP) - 2º Grau", url: "https://pje.trtsp.jus.br/pje2g/pje-presente.html", grupo: "SP", lote: 1 },
    { id: "tjsc_eproc", nome: "TJSC - eproc", url: "https://eproc2g.tjsc.jus.br/", grupo: "SC", lote: 1 },
    { id: "trt12_1g", nome: "TRT12 (SC) - 1º Grau", url: "https://pje.trt12.jus.br/pje/pje-presente.html", grupo: "SC", lote: 1 },
    { id: "trt12_2g", nome: "TRT12 (SC) - 2º Grau", url: "https://pje.trt12.jus.br/pje2g/pje-presente.html", grupo: "SC", lote: 1 },
    { id: "tjrs_eproc", nome: "TJRS - eproc", url: "https://eproc.tjrs.jus.br/", grupo: "RS", lote: 1 },
    { id: "trt4_1g", nome: "TRT4 (RS) - 1º Grau", url: "https://pje.trt4.jus.br/pje/pje-presente.html", grupo: "RS", lote: 1 },
    { id: "trt4_2g", nome: "TRT4 (RS) - 2º Grau", url: "https://pje.trt4.jus.br/pje2g/pje-presente.html", grupo: "RS", lote: 1 },
    { id: "tjdft_pje", nome: "TJDFT - PJe", url: "https://pje.tjdft.jus.br/", grupo: "DF", lote: 1 },

    // LOTE 2 (17 Tribunais) - Sudeste (Continuação), Centro-Oeste e Nordeste (Parte 1)
    { id: "tjrj_eproc", nome: "TJRJ - eproc", url: "https://eproc.tjrj.jus.br/", grupo: "RJ", lote: 2 },
    { id: "trt1_1g", nome: "TRT1 (RJ) - 1º Grau", url: "https://pje.trt1.jus.br/pje/pje-presente.html", grupo: "RJ", lote: 2 },
    { id: "trt1_2g", nome: "TRT1 (RJ) - 2º Grau", url: "https://pje.trt1.jus.br/pje2g/pje-presente.html", grupo: "RJ", lote: 2 },
    { id: "tjmg_pje", nome: "TJMG - PJe", url: "https://pje.tjmg.jus.br/", grupo: "MG", lote: 2 },
    { id: "trt3_1g", nome: "TRT3 (MG) - 1º Grau", url: "https://pje.trt3.jus.br/pje/pje-presente.html", grupo: "MG", lote: 2 },
    { id: "trt3_2g", nome: "TRT3 (MG) - 2º Grau", url: "https://pje.trt3.jus.br/pje2g/pje-presente.html", grupo: "MG", lote: 2 },
    { id: "tjes_pje", nome: "TJES - PJe", url: "https://pje.tjes.jus.br/", grupo: "ES", lote: 2 },
    { id: "trt17_1g", nome: "TRT17 (ES) - 1º Grau", url: "https://pje.trt17.jus.br/pje/pje-presente.html", grupo: "ES", lote: 2 },
    { id: "trt17_2g", nome: "TRT17 (ES) - 2º Grau", url: "https://pje.trt17.jus.br/pje2g/pje-presente.html", grupo: "ES", lote: 2 },
    { id: "tjms_saj", nome: "TJMS - SAJ", url: "https://esaj.tjms.jus.br/", grupo: "MS", lote: 2 },
    { id: "trt24_1g", nome: "TRT24 (MS) - 1º Grau", url: "https://pje.trt24.jus.br/pje/pje-presente.html", grupo: "MS", lote: 2 },
    { id: "trt24_2g", nome: "TRT24 (MS) - 2º Grau", url: "https://pje.trt24.jus.br/pje2g/pje-presente.html", grupo: "MS", lote: 2 },
    { id: "tjmt_pje", nome: "TJMT - PJe", url: "https://pje.tjmt.jus.br/", grupo: "MT", lote: 2 },
    { id: "trt23_1g", nome: "TRT23 (MT) - 1º Grau", url: "https://pje.trt23.jus.br/pje/pje-presente.html", grupo: "MT", lote: 2 },
    { id: "trt23_2g", nome: "TRT23 (MT) - 2º Grau", url: "https://pje.trt23.jus.br/pje2g/pje-presente.html", grupo: "MT", lote: 2 },
    { id: "tjgo_pje", nome: "TJGO - PJe", url: "https://pje.tjgo.jus.br/", grupo: "GO", lote: 2 },
    { id: "trt18_1g", nome: "TRT18 (GO) - 1º Grau", url: "https://pje.trt18.jus.br/pje/pje-presente.html", grupo: "GO", lote: 2 },

    // LOTE 3 (16 Tribunais) - Nordeste (Continuação), Norte e Restante do Brasil
    { id: "trt18_2g", nome: "TRT18 (GO) - 2º Grau", url: "https://pje.trt18.jus.br/pje2g/pje-presente.html", grupo: "GO", lote: 3 },
    { id: "trt10_1g", nome: "TRT10 (DF/TO) - 1º Grau", url: "https://pje.trt10.jus.br/pje/pje-presente.html", grupo: "DF", lote: 3 },
    { id: "trt10_2g", nome: "TRT10 (DF/TO) - 2º Grau", url: "https://pje.trt10.jus.br/pje2g/pje-presente.html", grupo: "DF", lote: 3 },
    { id: "tjba_pje", nome: "TJBA - PJe", url: "https://pje.tjba.jus.br/", grupo: "BA", lote: 3 },
    { id: "trt5_1g", nome: "TRT5 (BA) - 1º Grau", url: "https://pje.trt5.jus.br/pje/pje-presente.html", grupo: "BA", lote: 3 },
    { id: "trt5_2g", nome: "TRT5 (BA) - 2º Grau", url: "https://pje.trt5.jus.br/pje2g/pje-presente.html", grupo: "BA", lote: 3 },
    { id: "tjpe_pje", nome: "TJPE - PJe", url: "https://pje.tjpe.jus.br/", grupo: "PE", lote: 3 },
    { id: "trt6_1g", nome: "TRT6 (PE) - 1º Grau", url: "https://pje.trt6.jus.br/pje/pje-presente.html", group: "PE", lote: 3 },
    { id: "trt6_2g", nome: "TRT6 (PE) - 2º Grau", url: "https://pje.trt6.jus.br/pje2g/pje-presente.html", grupo: "PE", lote: 3 },
    { id: "tjce_saj", nome: "TJCE - SAJ", url: "https://esaj.tjce.jus.br/", grupo: "CE", lote: 3 },
    { id: "trt7_1g", nome: "TRT7 (CE) - 1º Grau", url: "https://pje.trt7.jus.br/pje/pje-presente.html", grupo: "CE", lote: 3 },
    { id: "trt7_2g", nome: "TRT7 (CE) - 2º Grau", url: "https://pje.trt7.jus.br/pje2g/pje-presente.html", grupo: "CE", lote: 3 },
    { id: "tjma_pje", nome: "TJMA - PJe", url: "https://pje.tjma.jus.br/", grupo: "MA", lote: 3 },
    { id: "tjpa_pje", nome: "TJPA - PJe", url: "https://pje.tjpa.jus.br/", grupo: "PA", lote: 3 },
    { id: "tjam_pje", nome: "TJAM - PJe", url: "https://pje.tjam.jus.br/", grupo: "AM", lote: 3 },
    { id: "tjto_eproc", nome: "TJTO - eproc", url: "https://eproc.tjto.jus.br/", grupo: "TO", lote: 3 }
];

async function testarAlvo(alvo) {
    const controlador = new AbortController();
    const idTimeout = setTimeout(() => controlador.abort(), 8500); // Subimos para 8.5s para acomodar o túnel de rede
    const inicio = Date.now();

    // Se for o STF ou TRF3, desvia a chamada pela API de Gateway dedicada do Webshare
    if (alvo.id === "stf" || alvo.id === "trf3") {
        try {
            const apiKey = "z2bnjbgeoc4v5c68z4bw9no4porfuaiqzq1soj3b";
            const respostaGateway = await fetch(`https://api.webshare.io/api/v2/proxy/page/get?url=${encodeURIComponent(alvo.url)}`, {
                method: 'GET',
                signal: controlador.signal,
                headers: {
                    'Authorization': `Token ${apiKey}`
                }
            });
            clearTimeout(idTimeout);
            
            if (respostaGateway.ok) {
                return {
                    id: alvo.id,
                    nome: alvo.nome,
                    grupo: alvo.grupo,
                    status: "Online",
                    latenciaMs: Date.now() - inicio
                };
            }
        } catch (errProxy) {
            console.error(`Falha na API Webshare para ${alvo.nome}:`, errProxy.message);
        }
    }

    // Fluxo Direto padrão para os outros tribunais normais
    try {
        await fetch(alvo.url, {
            method: 'GET',
            mode: 'no-cors',
            signal: controlador.signal,
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        clearTimeout(idTimeout);
        const latencia = Date.now() - inicio;
        return {
            id: alvo.id,
            nome: alvo.nome,
            grupo: alvo.grupo,
            status: latencia > 3000 ? "Lentidão" : "Online",
            latenciaMs: latencia
        };
    } catch (erro) {
        clearTimeout(idTimeout);
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { lote } = req.query;
    const numLote = parseInt(lote) || 1;
    const alvosDoLote = tribunais.filter(t => t.lote === numLote);

    if (alvosDoLote.length === 0) {
        return res.status(400).json({ erro: `Nenhum tribunal configurado para o lote ${numLote}.` });
    }

    try {
        let estadoGlobal = (await kv.get('advbr_status_global')) || {};
        
        const promessas = alvosDoLote.map(alvo => testarAlvo(alvo));
        const resultados = await Promise.all(promessas);

        resultados.forEach(item => {
            estadoGlobal[item.id] = item;
        });

        await kv.set('advbr_status_global', estadoGlobal);

        return res.status(200).json({ 
            sucesso: true, 
            mensagem: `Lote ${numLote} atualizado com mascaramento residencial.`,
            itens_processados: resultados.length 
        });
    } catch (erro) {
        console.error("Erro interno crítico no handler:", erro);
        return res.status(500).json({ erro: "Falha na persistência de dados.", detalhe: erro.message });
    }
}
