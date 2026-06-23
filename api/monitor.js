import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const tribunais = [
    // LOTE 1 (17 Tribunais) - Servidores Internos e Telas de Login Reais (Nacionais, Sul e Sudeste)
    { id: "pje_cnj", nome: "PJe Nacional (CNJ) - Servidor de Login", url: "https://pje.jus.br/pje/login.seam", grupo: "nacionais", lote: 1 },
    { id: "stj", nome: "STJ - Sistema de Justiça Eletrônica", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais", lote: 1 },
    { id: "stf", nome: "STF - Servidor de Autenticação PKI", url: "https://autenticacao.stf.jus.br/pki/login", grupo: "nacionais", lote: 1 },
    { id: "tjpr_eproc", nome: "TJPR - Servidor eproc 2G", url: "https://eproc.tjpr.jus.br/eproc_2g/externo_controlador.php?acao=principal", grupo: "PR", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Servidor Projudi", url: "https://projudi.tjpr.jus.br/projudi/login", grupo: "PR", lote: 1 },
    { id: "trt9_1g", nome: "TRT9 (PR) - Servidor PJe 1º Grau", url: "https://pje.trt9.jus.br/pje/login.seam", grupo: "PR", lote: 1 },
    { id: "trt9_2g", nome: "TRT9 (PR) - Servidor PJe 2º Grau", url: "https://pje.trt9.jus.br/pje2g/login.seam", grupo: "PR", lote: 1 },
    { id: "tjsp_saj", nome: "TJSP - Servidor de Login eSAJ", url: "https://esaj.tjsp.jus.br/sajps/login.do", grupo: "SP", lote: 1 },
    { id: "trt2_1g", nome: "TRT2 (SP) - Servidor PJe 1º Grau", url: "https://pje.trtsp.jus.br/pje/login.seam", grupo: "SP", lote: 1 },
    { id: "trt2_2g", nome: "TRT2 (SP) - Servidor PJe 2º Grau", url: "https://pje.trtsp.jus.br/pje2g/login.seam", grupo: "SP", lote: 1 },
    { id: "tjsc_eproc", nome: "TJSC - Servidor eproc 2G", url: "https://eproc2g.tjsc.jus.br/eproc/externo_controlador.php", grupo: "SC", lote: 1 },
    { id: "trt12_1g", nome: "TRT12 (SC) - Servidor PJe 1º Grau", url: "https://pje.trt12.jus.br/pje/login.seam", grupo: "SC", lote: 1 },
    { id: "trt12_2g", nome: "TRT12 (SC) - Servidor PJe 2º Grau", url: "https://pje.trt12.jus.br/pje2g/login.seam", grupo: "SC", lote: 1 },
    { id: "tjrs_eproc", nome: "TJRS - Servidor eproc Principal", url: "https://eproc.tjrs.jus.br/eproc/externo_controlador.php", grupo: "RS", lote: 1 },
    { id: "trt4_1g", nome: "TRT4 (RS) - Servidor PJe 1º Grau", url: "https://pje.trt4.jus.br/pje/login.seam", grupo: "RS", lote: 1 },
    { id: "trt4_2g", nome: "TRT4 (RS) - Servidor PJe 2º Grau", url: "https://pje.trt4.jus.br/pje2g/login.seam", grupo: "RS", lote: 1 },
    { id: "tjdft_pje", nome: "TJDFT - Servidor PJe Login", url: "https://pje.tjdft.jus.br/pje/login.seam", grupo: "DF", lote: 1 },

    // LOTE 2 (17 Tribunais) - Outros Servidores de Sessão Interna
    { id: "trf3", nome: "TRF3 - Servidor PJe 1º Grau", url: "https://pje1g.trf3.jus.br/pje/login.seam", grupo: "nacionais", lote: 2 },
    { id: "tjrj_eproc", nome: "TJRJ - Servidor eproc Login", url: "https://eproc.tjrj.jus.br/eproc/externo_controlador.php", grupo: "RJ", lote: 2 },
    { id: "trt1_1g", nome: "TRT1 (RJ) - Servidor PJe 1º Grau", url: "https://pje.trt1.jus.br/pje/login.seam", grupo: "RJ", lote: 2 },
    { id: "trt1_2g", nome: "TRT1 (RJ) - Servidor PJe 2º Grau", url: "https://pje.trt1.jus.br/pje2g/login.seam", grupo: "RJ", lote: 2 },
    { id: "tjmg_pje", nome: "TJMG - Servidor PJe Login", url: "https://pje.tjmg.jus.br/pje/login.seam", grupo: "MG", lote: 2 },
    { id: "trt3_1g", nome: "TRT3 (MG) - Servidor PJe 1º Grau", url: "https://pje.trt3.jus.br/pje/login.seam", grupo: "MG", lote: 2 },
    { id: "trt3_2g", nome: "TRT3 (MG) - Servidor PJe 2º Grau", url: "https://pje.trt3.jus.br/pje2g/login.seam", grupo: "MG", lote: 2 },
    { id: "tjes_pje", nome: "TJES - Servidor PJe Login", url: "https://pje.tjes.jus.br/pje/login.seam", grupo: "ES", lote: 2 },
    { id: "trt17_1g", nome: "TRT17 (ES) - Servidor PJe 1º Grau", url: "https://pje.trt17.jus.br/pje/login.seam", grupo: "ES", lote: 2 },
    { id: "trt17_2g", nome: "TRT17 (ES) - Servidor PJe 2º Grau", url: "https://pje.trt17.jus.br/pje2g/login.seam", grupo: "ES", lote: 2 },
    { id: "tjms_saj", nome: "TJMS - Servidor eSAJ Login", url: "https://esaj.tjms.jus.br/sajps/login.do", grupo: "MS", lote: 2 },
    { id: "trt24_1g", nome: "TRT24 (MS) - Servidor PJe 1º Grau", url: "https://pje.trt24.jus.br/pje/login.seam", grupo: "MS", lote: 2 },
    { id: "trt24_2g", nome: "TRT24 (MS) - Servidor PJe 2º Grau", url: "https://pje.trt24.jus.br/pje2g/login.seam", grupo: "MS", lote: 2 },
    { id: "tjmt_pje", nome: "TJMT - Servidor PJe Login", url: "https://pje.tjmt.jus.br/pje/login.seam", grupo: "MT", lote: 2 },
    { id: "trt23_1g", nome: "TRT23 (MT) - Servidor PJe 1º Grau", url: "https://pje.trt23.jus.br/pje/login.seam", grupo: "MT", lote: 2 },
    { id: "trt23_2g", nome: "TRT23 (MT) - Servidor PJe 2º Grau", url: "https://pje.trt23.jus.br/pje2g/login.seam", grupo: "MT", lote: 2 },
    { id: "tjgo_pje", nome: "TJGO - Servidor PJe Login", url: "https://pje.tjgo.jus.br/pje/login.seam", grupo: "GO", lote: 2 },

    // LOTE 3 (16 Tribunais) - Demais Acessos de Produção Interna
    { id: "trt18_1g", nome: "TRT18 (GO) - Servidor PJe 1º Grau", url: "https://pje.trt18.jus.br/pje/login.seam", grupo: "GO", lote: 3 },
    { id: "trt18_2g", nome: "TRT18 (GO) - Servidor PJe 2º Grau", url: "https://pje.trt18.jus.br/pje2g/login.seam", grupo: "GO", lote: 3 },
    { id: "trt10_1g", nome: "TRT10 (DF) - Servidor PJe 1º Grau", url: "https://pje.trt10.jus.br/pje/login.seam", grupo: "DF", lote: 3 },
    { id: "trt10_2g", nome: "TRT10 (DF) - Servidor PJe 2º Grau", url: "https://pje.trt10.jus.br/pje2g/login.seam", grupo: "DF", lote: 3 },
    { id: "tjba_pje", nome: "TJBA - Servidor PJe Login", url: "https://pje.tjba.jus.br/pje/login.seam", grupo: "BA", lote: 3 },
    { id: "trt5_1g", nome: "TRT5 (BA) - Servidor PJe 1º Grau", url: "https://pje.trt5.jus.br/pje/login.seam", grupo: "BA", lote: 3 },
    { id: "trt5_2g", nome: "TRT5 (BA) - Servidor PJe 2º Grau", url: "https://pje.trt5.jus.br/pje2g/login.seam", grupo: "BA", lote: 3 },
    { id: "tjpe_pje", nome: "TJPE - Servidor PJe Login", url: "https://pje.tjpe.jus.br/pje/login.seam", grupo: "PE", lote: 3 },
    { id: "trt6_1g", nome: "TRT6 (PE) - Servidor PJe 1º Grau", url: "https://pje.trt6.jus.br/pje/login.seam", grupo: "PE", lote: 3 },
    { id: "trt6_2g", nome: "TRT6 (PE) - Servidor PJe 2º Grau", url: "https://pje.trt6.jus.br/pje2g/login.seam", grupo: "PE", lote: 3 },
    { id: "tjce_saj", nome: "TJCE - Servidor eSAJ Login", url: "https://esaj.tjce.jus.br/sajps/login.do", grupo: "CE", lote: 3 },
    { id: "trt7_1g", nome: "TRT7 (CE) - Servidor PJe 1º Grau", url: "https://pje.trt7.jus.br/pje/login.seam", grupo: "CE", lote: 3 },
    { id: "trt7_2g", nome: "TRT7 (CE) - Servidor PJe 2º Grau", url: "https://pje.trt7.jus.br/pje2g/login.seam", grupo: "CE", lote: 3 },
    { id: "tjma_pje", nome: "TJMA - Servidor PJe Login", url: "https://pje.tjma.jus.br/pje/login.seam", grupo: "MA", lote: 3 },
    { id: "tjpa_pje", nome: "TJPA - Servidor PJe Login", url: "https://pje.tjpa.jus.br/pje/login.seam", grupo: "PA", lote: 3 },
    { id: "tjam_pje", nome: "TJAM - Servidor PJe Login", url: "https://pje.tjam.jus.br/pje/login.seam", grupo: "AM", lote: 3 },
    { id: "tjto_eproc", nome: "TJTO - Servidor eproc Login", url: "https://eproc.tjto.jus.br/eproc/externo_controlador.php", grupo: "TO", lote: 3 }
];

async function testarAlvo(alvo) {
    const controlador = new AbortController();
    const idTimeout = setTimeout(() => controlador.abort(), 5000); 
    const inicio = Date.now();

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
            mensagem: `Lote ${numLote} sincronizado focando exclusivamente em servidores de produção.`,
            itens_processados: resultados.length 
        });
    } catch (erro) {
        console.error("Erro interno crítico no handler:", erro);
        return res.status(500).json({ erro: "Falha na persistência de dados.", detalhe: erro.message });
    }
}
