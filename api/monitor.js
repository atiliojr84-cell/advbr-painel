import { createClient } from '@vercel/kv';
import net from 'net';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const tribunais = [
    // LOTE 1 (16 Tribunais) - Nacionais e Região Sul/Sudeste Principal
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://pje.jus.br/pje/login.seam", grupo: "nacionais", lote: 1 },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais", lote: 1 },
    { id: "stf", nome: "STF - Eletrônico", url: "https://autenticacao.stf.jus.br/pki/login", grupo: "nacionais", lote: 1 },
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/eproc_2g/externo_controlador.php?acao=principal", grupo: "PR", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/login", grupo: "PR", lote: 1 },
    { id: "trt9_1g", nome: "TRT9 (PR) - 1º Grau", url: "https://pje.trt9.jus.br/pje/login.seam", grupo: "PR", lote: 1 },
    { id: "trt9_2g", nome: "TRT9 (PR) - 2º Grau", url: "https://pje.trt9.jus.br/pje2g/login.seam", grupo: "PR", lote: 1 },
    { id: "tjsp_saj", nome: "TJSP - SAJ", url: "https://esaj.tjsp.jus.br/sajps/login.do", grupo: "SP", lote: 1 },
    { id: "trt2_1g", nome: "TRT2 (SP) - 1º Grau", url: "https://pje.trtsp.jus.br/pje/login.seam", grupo: "SP", lote: 1 },
    { id: "trt2_2g", nome: "TRT2 (SP) - 2º Grau", url: "https://pje.trtsp.jus.br/pje2g/login.seam", grupo: "SP", lote: 1 },
    { id: "tjsc_eproc", nome: "TJSC - eproc", url: "https://eproc2g.tjsc.jus.br/eproc/externo_controlador.php", grupo: "SC", lote: 1 },
    { id: "trt12_1g", nome: "TRT12 (SC) - 1º Grau", url: "https://pje.trt12.jus.br/pje/login.seam", grupo: "SC", lote: 1 },
    { id: "trt12_2g", nome: "TRT12 (SC) - 2º Grau", url: "https://pje.trt12.jus.br/pje2g/login.seam", grupo: "SC", lote: 1 },
    { id: "tjrs_eproc", nome: "TJRS - eproc", url: "https://eproc.tjrs.jus.br/eproc/externo_controlador.php", grupo: "RS", lote: 1 },
    { id: "trt4_1g", nome: "TRT4 (RS) - 1º Grau", url: "https://pje.trt4.jus.br/pje/login.seam", grupo: "RS", lote: 1 },
    { id: "trt4_2g", nome: "TRT4 (RS) - 2º Grau", url: "https://pje.trt4.jus.br/pje2g/login.seam", grupo: "RS", lote: 1 },

    // LOTE 2 (16 Tribunais) - Região Sudeste (Continuação) e Centro-Oeste
    { id: "tjdft_pje", nome: "TJDFT - PJe", url: "https://pje.tjdft.jus.br/pje/login.seam", grupo: "DF", lote: 2 },
    { id: "tjrj_eproc", nome: "TJRJ - eproc", url: "https://eproc.tjrj.jus.br/eproc/externo_controlador.php", grupo: "RJ", lote: 2 },
    { id: "trt1_1g", nome: "TRT1 (RJ) - 1º Grau", url: "https://pje.trt1.jus.br/pje/login.seam", grupo: "RJ", lote: 2 },
    { id: "trt1_2g", nome: "TRT1 (RJ) - 2º Grau", url: "https://pje.trt1.jus.br/pje2g/login.seam", grupo: "RJ", lote: 2 },
    { id: "tjmg_pje", nome: "TJMG - PJe", url: "https://pje.tjmg.jus.br/pje/login.seam", grupo: "MG", lote: 2 },
    { id: "trt3_1g", nome: "TRT3 (MG) - 1º Grau", url: "https://pje.trt3.jus.br/pje/login.seam", grupo: "MG", lote: 2 },
    { id: "trt3_2g", nome: "TRT3 (MG) - 2º Grau", url: "https://pje.trt3.jus.br/pje2g/login.seam", grupo: "MG", lote: 2 },
    { id: "tjes_pje", nome: "TJES - PJe", url: "https://pje.tjes.jus.br/pje/login.seam", grupo: "ES", lote: 2 },
    { id: "trt17_1g", nome: "TRT17 (ES) - 1º Grau", url: "https://pje.trt17.jus.br/pje/login.seam", grupo: "ES", lote: 2 },
    { id: "trt17_2g", nome: "TRT17 (ES) - 2º Grau", url: "https://pje.trt17.jus.br/pki/login.seam", grupo: "ES", lote: 2 },
    { id: "tjms_saj", nome: "TJMS - SAJ", url: "https://esaj.tjms.jus.br/sajps/login.do", grupo: "MS", lote: 2 },
    { id: "trt24_1g", nome: "TRT24 (MS) - 1º Grau", url: "https://pje.trt24.jus.br/pje/login.seam", grupo: "MS", lote: 2 },
    { id: "trt24_2g", nome: "TRT24 (MS) - 2º Grau", url: "https://pje.trt24.jus.br/pje2g/login.seam", grupo: "MS", lote: 2 },
    { id: "tjmt_pje", nome: "TJMT - PJe", url: "https://pje.tjmt.jus.br/pje/login.seam", grupo: "MT", lote: 2 },
    { id: "trt23_1g", nome: "TRT23 (MT) - 1º Grau", url: "https://pje.trt23.jus.br/pje/login.seam", grupo: "MT", lote: 2 },
    { id: "trt23_2g", nome: "TRT23 (MT) - 2º Grau", url: "https://pje.trt23.jus.br/pje2g/login.seam", grupo: "MT", lote: 2 },

    // LOTE 3 (16 Tribunais) - Centro-Oeste (Continuação) e Nordeste Principal
    { id: "trf3", nome: "TRF3 - PJe", url: "https://pje1g.trf3.jus.br/pje/ConsultaPublica/listView.seam", grupo: "nacionais", lote: 3 },
    { id: "tjgo_pje", nome: "TJGO - PJe", url: "https://pje.tjgo.jus.br/pje/login.seam", grupo: "GO", lote: 3 },
    { id: "trt18_1g", nome: "TRT18 (GO) - 1º Grau", url: "https://pje.trt18.jus.br/pje/login.seam", grupo: "GO", lote: 3 },
    { id: "trt18_2g", nome: "TRT18 (GO) - 2º Grau", url: "https://pje.trt18.jus.br/pje2g/login.seam", grupo: "GO", lote: 3 },
    { id: "trt10_1g", nome: "TRT10 (DF/TO) - 1º Grau", url: "https://pje.trt10.jus.br/pje/login.seam", grupo: "DF", lote: 3 },
    { id: "trt10_2g", nome: "TRT10 (DF/TO) - 2º Grau", url: "https://pje.trt10.jus.br/pje2g/login.seam", grupo: "DF", lote: 3 },
    { id: "tjba_pje", nome: "TJBA - PJe", url: "https://pje.tjba.jus.br/pje/login.seam", grupo: "BA", lote: 3 },
    { id: "trt5_1g", nome: "TRT5 (BA) - 1º Grau", url: "https://pje.trt5.jus.br/pje/login.seam", grupo: "BA", lote: 3 },
    { id: "trt5_2g", nome: "TRT5 (BA) - 2º Grau", url: "https://pje.trt5.jus.br/pje2g/login.seam", grupo: "BA", lote: 3 },
    { id: "tjpe_pje", nome: "TJPE - PJe", url: "https://pje.tjpe.jus.br/pje/login.seam", grupo: "PE", lote: 3 },
    { id: "trt6_1g", nome: "TRT6 (PE) - 1º Grau", url: "https://pje.trt6.jus.br/pje/login.seam", grupo: "PE", lote: 3 },
    { id: "trt6_2g", nome: "TRT6 (PE) - 2º Grau", url: "https://pje.trt6.jus.br/pje2g/login.seam", grupo: "PE", lote: 3 },
    { id: "tjce_saj", nome: "TJCE - SAJ", url: "https://esaj.tjce.jus.br/sajps/login.do", grupo: "CE", lote: 3 },
    { id: "trt7_1g", nome: "TRT7 (CE) - 1º Grau", url: "https://pje.trt7.jus.br/pje/login.seam", grupo: "CE", lote: 3 },
    { id: "trt7_2g", nome: "TRT7 (CE) - 2º Grau", url: "https://pje.trt7.jus.br/pje2g/login.seam", grupo: "CE", lote: 3 },
    { id: "tjma_pje", nome: "TJMA - PJe", url: "https://pje.tjma.jus.br/pje/login.seam", grupo: "MA", lote: 3 },

    // LOTE 4 (17 Tribunais) - Restante do Nordeste e Região Norte Completa + SAJ Acre
    { id: "trt16_1g", nome: "TRT16 (MA) - 1º Grau", url: "https://pje.trt16.jus.br/pje/login.seam", grupo: "MA", lote: 4 },
    { id: "tjpa_pje", nome: "TJPA - PJe", url: "https://pje.tjpa.jus.br/pje/login.seam", grupo: "PA", lote: 4 },
    { id: "trt8_1g_pa", nome: "TRT8 (PA/AP) - 1º Grau", url: "https://pje.trt8.jus.br/pje/login.seam", grupo: "PA", lote: 4 },
    { id: "tjam_pje", nome: "TJAM - PJe", url: "https://pje.tjam.jus.br/pje/login.seam", grupo: "AM", lote: 4 },
    { id: "trt11_1g", nome: "TRT11 (AM/RR) - 1º Grau", url: "https://pje.trt11.jus.br/pje/login.seam", grupo: "AM", lote: 4 },
    { id: "tjto_eproc", nome: "TJTO - eproc", url: "https://eproc.tjto.jus.br/eproc/externo_controlador.php", grupo: "TO", lote: 4 },
    { id: "tjac_pje", nome: "TJAC - PJe", url: "https://pje.tjac.jus.br/pje/ConsultaPublica/listView.seam", grupo: "AC", lote: 4 },
    { id: "tjac_saj", nome: "TJAC - e-SAJ", url: "https://esaj.tjac.jus.br/sajps/login.do", grupo: "AC", lote: 4 },
    { id: "trt14_1g", nome: "TRT14 (RO/AC) - 1º Grau", url: "https://pje.trt14.jus.br/pje/login.seam", grupo: "AC", lote: 4 },
    { id: "tjal_pje", nome: "TJAL - PJe", url: "https://pje.tjal.jus.br/pje/login.seam", grupo: "AL", lote: 4 },
    { id: "trt19_1g", nome: "TRT19 (AL) - 1º Grau", url: "https://pje.trt19.jus.br/pje/login.seam", grupo: "AL", lote: 4 },
    { id: "tjap_pje", nome: "TJAP - PJe", url: "https://pje.tjap.jus.br/pje/login.seam", grupo: "AP", lote: 4 },
    { id: "tjpb_pje", nome: "TJPB - PJe", url: "https://pje.tjpb.jus.br/pje/login.seam", grupo: "PB", lote: 4 },
    { id: "trt13_1g", nome: "TRT13 (PB) - 1º Grau", url: "https://pje.trt13.jus.br/pje/login.seam", grupo: "PB", lote: 4 },
    { id: "tjpi_pje", nome: "TJPI - PJe", url: "https://pje.tjpi.jus.br/pje/login.seam", grupo: "PI", lote: 4 },
    { id: "trt22_1g", nome: "TRT22 (PI) - 1º Grau", url: "https://pje.trt22.jus.br/pje/login.seam", grupo: "PI", lote: 4 },
    { id: "tjrn_pje", nome: "TJRN - PJe", url: "https://pje.tjrn.jus.br/pje/login.seam", grupo: "RN", lote: 4 }
];

async function executarPingSocket(alvo) {
    return new Promise((resolve) => {
        const host = new URL(alvo.url).hostname;
        const port = 443; // Porta padrão HTTPS
        const timeoutMs = 3500; // Limite de 3.5 segundos
        
        const start = Date.now();
        const socket = new net.Socket();

        // Se o tribunal não responder nada em 3.5s, matamos o processo.
        const timer = setTimeout(() => {
            socket.destroy();
            resolve({
                id: alvo.id,
                nome: alvo.nome,
                grupo: alvo.grupo,
                status: "Fora do Ar",
                latenciaMs: null
            });
        }, timeoutMs);

        // Se o tribunal aceitar a conexão física (Porta aberta), é Sucesso!
        socket.on('connect', () => {
            const tempoGasto = Date.now() - start;
            clearTimeout(timer);
            socket.destroy(); // Fecha imediatamente sem mandar pacote HTTP
            
            // TCP é quase instantâneo. Se passar de 800ms já consideramos Lentidão na infra do tribunal.
            resolve({
                id: alvo.id,
                nome: alvo.nome,
                grupo: alvo.grupo,
                status: tempoGasto > 800 ? "Lentidão" : "Online",
                latenciaMs: tempoGasto
            });
        });

        // Se o firewall rejeitar ativamente a conexão (TCP Reset), tratamos como Fora do Ar.
        socket.on('error', () => {
            clearTimeout(timer);
            socket.destroy();
            resolve({
                id: alvo.id,
                nome: alvo.nome,
                grupo: alvo.grupo,
                status: "Fora do Ar",
                latenciaMs: null
            });
        });

        // Inicia a batida na porta
        socket.connect(port, host);
    });
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
        
        // Dispara os pings TCP em paralelo para máxima velocidade
        const promessas = alvosDoLote.map(alvo => executarPingSocket(alvo));
        const resultados = await Promise.all(promessas);

        resultados.forEach(item => {
            estadoGlobal[item.id] = item;
        });

        await kv.set('advbr_status_global', estadoGlobal);

        return res.status(200).json({ 
            sucesso: true, 
            mensagem: `Lote ${numLote} sincronizado via TCP Socket Puro.`,
            itens_processados: resultados.length 
        });
    } catch (erro) {
        console.error("Erro interno crítico no handler do motor:", erro);
        return res.status(500).json({ erro: "Falha na persistência de dados.", detalhe: erro.message });
    }
}
