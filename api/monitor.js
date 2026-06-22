// api/monitor.js - Sistema Unificado por Lotes com Tratamento de Erros
import textEncoding from 'text-encoding';

const tribunais = [
    // === SISTEMAS NACIONAIS (Lote 1) ===
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://www.pje.jus.br/navegador/", grupo: "nacionais", lote: 1 },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais", lote: 1 },
    { id: "stf", nome: "STF - Eletrônico", url: "https://portal.stf.jus.br/", grupo: "nacionais", lote: 1 },
    
    // === ESTADOS - TJs ESTADUAIS ===
    { id: "tjac_pje", nome: "TJAC - PJe", url: "https://pje.tjac.jus.br/", grupo: "AC", lote: 1 },
    { id: "tjal_paj", nome: "TJAL - SAJ", url: "https://esaj.tjal.jus.br/", grupo: "AL", lote: 1 },
    { id: "tjap_tucujuris", nome: "TJAP - Tucujuris", url: "https://tucujuris.tjap.jus.br/", grupo: "AM", lote: 1 },
    { id: "tjam_pje", nome: "TJAM - PJe", url: "https://pje.tjam.jus.br/", grupo: "AM", lote: 1 },
    { id: "tjba_pje", nome: "TJBA - PJe", url: "https://pje.tjba.jus.br/", grupo: "BA", lote: 1 },
    { id: "tjce_saj", nome: "TJCE - SAJ", url: "https://esaj.tjce.jus.br/", grupo: "CE", lote: 1 },
    { id: "tjdft_pje", nome: "TJDFT - PJe", url: "https://pje.tjdft.jus.br/", grupo: "DF", lote: 1 },
    { id: "tjes_pje", nome: "TJES - PJe", url: "https://pje.tjes.jus.br/", grupo: "ES", lote: 1 },
    { id: "tjgo_pje", nome: "TJGO - PJe", url: "https://pje.tjgo.jus.br/", grupo: "GO", lote: 2 },
    { id: "tjma_pje", nome: "TJMA - PJe", url: "https://pje.tjma.jus.br/", grupo: "MA", lote: 2 },
    { id: "tjmt_pje", nome: "TJMT - PJe", url: "https://pje.tjmt.jus.br/", grupo: "MT", lote: 2 },
    { id: "tjms_saj", nome: "TJMS - SAJ", url: "https://esaj.tjms.jus.br/", grupo: "MS", lote: 2 },
    { id: "tjmg_pje", nome: "TJMG - PJe", url: "https://pje.tjmg.jus.br/", grupo: "MG", lote: 2 },
    { id: "tjpa_pje", nome: "TJPA - PJe", url: "https://pje.tjpa.jus.br/", grupo: "PA", lote: 2 },
    { id: "tjpb_pje", nome: "TJPB - PJe", url: "https://pje.tjpb.jus.br/", grupo: "PB", lote: 2 },
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/eproc_2g/", grupo: "PR", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/", grupo: "PR", lote: 1 },
    { id: "tjpe_pje", nome: "TJPE - PJe", url: "https://pje.tjpe.jus.br/", grupo: "PE", lote: 3 },
    { id: "tjpi_pje", nome: "TJPI - PJe", url: "https://pje.tjpi.jus.br/", grupo: "PI", lote: 3 },
    { id: "tjrj_eproc", nome: "TJRJ - eproc", url: "https://eproc.tjrj.jus.br/", grupo: "RJ", lote: 3 },
    { id: "tjrn_pje", nome: "TJRN - PJe", url: "https://pje.tjrn.jus.br/", grupo: "RN", lote: 3 },
    { id: "tjrs_eproc", nome: "TJRS - eproc", url: "https://eproc.tjrs.jus.br/", grupo: "RS", lote: 3 },
    { id: "tjro_pje", nome: "TJRO - PJe", url: "https://pje.tjro.jus.br/", grupo: "RO", lote: 3 },
    { id: "tjrr_projudi", nome: "TJRR - Projudi", url: "https://projudi.tjrr.jus.br/", grupo: "RR", lote: 3 },
    { id: "tjsc_eproc", nome: "TJSC - eproc", url: "https://eproc2g.tjsc.jus.br/", grupo: "SC", lote: 3 },
    { id: "tjsp_saj", nome: "TJSP - SAJ", url: "https://esaj.tjsp.jus.br/", grupo: "SP", lote: 3 },
    { id: "tjse_portal", nome: "TJSE - Processos", url: "https://www.tjse.jus.br/", grupo: "SE", lote: 3 },
    { id: "tjto_eproc", nome: "TJTO - eproc", url: "https://eproc.tjto.jus.br/", grupo: "TO", lote: 3 },

    // === JUSTIÇA DO TRABALHO (TRTs 1G e 2G) ===
    { id: "trt1_1g", nome: "TRT1 (RJ) - 1º Grau", url: "https://pje.trt1.jus.br/pje/pje-presente.html", grupo: "RJ", lote: 1 },
    { id: "trt1_2g", nome: "TRT1 (RJ) - 2º Grau", url: "https://pje.trt1.jus.br/pje2g/pje-presente.html", grupo: "RJ", lote: 1 },
    { id: "trt2_1g", nome: "TRT2 (SP) - 1º Grau", url: "https://pje.trtsp.jus.br/pje/pje-presente.html", grupo: "SP", lote: 1 },
    { id: "trt2_2g", nome: "TRT2 (SP) - 2º Grau", url: "https://pje.trtsp.jus.br/pje2g/pje-presente.html", grupo: "SP", lote: 1 },
    { id: "trt3_1g", nome: "TRT3 (MG) - 1º Grau", url: "https://pje.trt3.jus.br/pje/pje-presente.html", grupo: "MG", lote: 1 },
    { id: "trt3_2g", nome: "TRT3 (MG) - 2º Grau", url: "https://pje.trt3.jus.br/pje2g/pje-presente.html", grupo: "MG", lote: 1 },
    { id: "trt4_1g", nome: "TRT4 (RS) - 1º Grau", url: "https://pje.trt4.jus.br/pje/pje-presente.html", grupo: "RS", lote: 1 },
    { id: "trt4_2g", nome: "TRT4 (RS) - 2º Grau", url: "https://pje.trt4.jus.br/pje2g/pje-presente.html", grupo: "RS", lote: 1 },
    { id: "trt5_1g", nome: "TRT5 (BA) - 1º Grau", url: "https://pje.trt5.jus.br/pje/pje-presente.html", grupo: "BA", lote: 1 },
    { id: "trt5_2g", nome: "TRT5 (BA) - 2º Grau", url: "https://pje.trt5.jus.br/pje2g/pje-presente.html", grupo: "BA", lote: 1 },
    { id: "trt6_1g", nome: "TRT6 (PE) - 1º Grau", url: "https://pje.trt6.jus.br/pje/pje-presente.html", grupo: "PE", lote: 1 },
    { id: "trt6_2g", nome: "TRT6 (PE) - 2º Grau", url: "https://pje.trt6.jus.br/pje2g/pje-presente.html", grupo: "PE", lote: 1 },
    { id: "trt7_1g", nome: "TRT7 (CE) - 1º Grau", url: "https://pje.trt7.jus.br/pje/pje-presente.html", grupo: "CE", lote: 2 },
    { id: "trt7_2g", nome: "TRT7 (CE) - 2º Grau", url: "https://pje.trt7.jus.br/pje2g/pje-presente.html", grupo: "CE", lote: 2 },
    { id: "trt8_1g", nome: "TRT8 (PA/AP) - 1º Grau", url: "https://pje.trt8.jus.br/pje/pje-presente.html", grupo: "PA", lote: 2 },
    { id: "trt8_2g", nome: "TRT8 (PA/AP) - 2º Grau", url: "https://pje.trt8.jus.br/pje2g/pje-presente.html", grupo: "PA", lote: 2 },
    { id: "trt9_1g", nome: "TRT9 (PR) - 1º Grau", url: "https://pje.trt9.jus.br/pje/pje-presente.html", grupo: "PR", lote: 1 },
    { id: "trt9_2g", nome: "TRT9 (PR) - 2º Grau", url: "https://pje.trt9.jus.br/pje2g/pje-presente.html", grupo: "PR", lote: 1 },
    { id: "trt10_1g", nome: "TRT10 (DF/TO) - 1º Grau", url: "https://pje.trt10.jus.br/pje/pje-presente.html", grupo: "DF", lote: 2 },
    { id: "trt10_2g", nome: "TRT10 (DF/TO) - 2º Grau", url: "https://pje.trt10.jus.br/pje2g/pje-presente.html", grupo: "DF", lote: 2 },
    { id: "trt11_1g", nome: "TRT11 (AM/RR) - 1º Grau", url: "https://pje.trt11.jus.br/pje/pje-presente.html", grupo: "AM", lote: 2 },
    { id: "trt11_2g", nome: "TRT11 (AM/RR) - 2º Grau", url: "https://pje.trt11.jus.br/pje2g/pje-presente.html", grupo: "AM", lote: 2 },
    { id: "trt12_1g", nome: "TRT12 (SC) - 1º Grau", url: "https://pje.trt12.jus.br/pje/pje-presente.html", grupo: "SC", lote: 2 },
    { id: "trt12_2g", nome: "TRT12 (SC) - 2º Grau", url: "https://pje.trt12.jus.br/pje2g/pje-presente.html", grupo: "SC", lote: 2 },
    { id: "trt13_1g", nome: "TRT13 (PB) - 1º Grau", url: "https://pje.trt13.jus.br/pje/pje-presente.html", grupo: "PB", lote: 2 },
    { id: "trt13_2g", nome: "TRT13 (PB) - 2º Grau", url: "https://pje.trt13.jus.br/pje2g/pje-presente.html", grupo: "PB", lote: 2 },
    { id: "trt14_1g", nome: "TRT14 (RO/AC) - 1º Grau", url: "https://pje.trt14.jus.br/pje/pje-presente.html", grupo: "RO", lote: 2 },
    { id: "trt14_2g", nome: "TRT14 (RO/AC) - 2º Grau", url: "https://pje.trt14.jus.br/pje2g/pje-presente.html", grupo: "RO", lote: 2 },
    { id: "trt15_1g", nome: "TRT15 (SP-Campinas) - 1º Grau", url: "https://pje.trt15.jus.br/pje/pje-presente.html", grupo: "SP", lote: 2 },
    { id: "trt15_2g", nome: "TRT15 (SP-Campinas) - 2º Grau", url: "https://pje.trt15.jus.br/pje2g/pje-presente.html", grupo: "SP", lote: 2 },
    { id: "trt16_1g", nome: "TRT16 (MA) - 1º Grau", url: "https://pje.trt16.jus.br/pje/pje-presente.html", grupo: "MA", lote: 3 },
    { id: "trt16_2g", nome: "TRT16 (MA) - 2º Grau", url: "https://pje.trt16.jus.br/pje2g/pje-presente.html", grupo: "MA", lote: 3 },
    { id: "trt17_1g", nome: "TRT17 (ES) - 1º Grau", url: "https://pje.trt17.jus.br/pje/pje-presente.html", grupo: "ES", lote: 3 },
    { id: "trt17_2g", nome: "TRT17 (ES) - 2º Grau", url: "https://pje.trt17.jus.br/pje2g/pje-presente.html", grupo: "ES", lote: 3 },
    { id: "trt18_1g", nome: "TRT18 (GO) - 1º Grau", url: "https://pje.trt18.jus.br/pje/pje-presente.html", grupo: "GO", lote: 3 },
    { id: "trt18_2g", nome: "TRT18 (GO) - 2º Grau", url: "https://pje.trt18.jus.br/pje2g/pje-presente.html", grupo: "GO", lote: 3 },
    { id: "trt19_1g", nome: "TRT19 (AL) - 1º Grau", url: "https://pje.trt19.jus.br/pje/pje-presente.html", grupo: "AL", lote: 3 },
    { id: "trt19_2g", nome: "TRT19 (AL) - 2º Grau", url: "https://pje.trt19.jus.br/pje2g/pje-presente.html", grupo: "AL", lote: 3 },
    { id: "trt20_1g", nome: "TRT20 (SE) - 1º Grau", url: "https://pje.trt20.jus.br/pje/pje-presente.html", grupo: "SE", lote: 3 },
    { id: "trt20_2g", nome: "TRT20 (SE) - 2º Grau", url: "https://pje.trt20.jus.br/pje2g/pje-presente.html", grupo: "SE", lote: 3 },
    { id: "trt21_1g", nome: "TRT21 (RN) - 1º Grau", url: "https://pje.trt21.jus.br/pje/pje-presente.html", grupo: "RN", lote: 3 },
    { id: "trt21_2g", nome: "TRT21 (RN) - 2º Grau", url: "https://pje.trt21.jus.br/pje2g/pje-presente.html", grupo: "RN", lote: 3 },
    { id: "trt22_1g", nome: "TRT22 (PI) - 1º Grau", url: "https://pje.trt22.jus.br/pje/pje-presente.html", grupo: "PI", lote: 3 },
    { id: "trt22_2g", nome: "TRT22 (PI) - 2º Grau", url: "https://pje.trt22.jus.br/pje2g/pje-presente.html", grupo: "PI", lote: 3 },
    { id: "trt23_1g", nome: "TRT23 (MT) - 1º Grau", url: "https://pje.trt23.jus.br/pje/pje-presente.html", grupo: "MT", lote: 3 },
    { id: "trt23_2g", nome: "TRT23 (MT) - 2º Grau", url: "https://pje.trt23.jus.br/pje2g/pje-presente.html", grupo: "MT", lote: 3 },
    { id: "trt24_1g", nome: "TRT24 (MS) - 1º Grau", url: "https://pje.trt24.jus.br/pje/pje-presente.html", grupo: "MS", lote: 3 },
    { id: "trt24_2g", nome: "TRT24 (MS) - 2º Grau", url: "https://pje.trt24.jus.br/pje2g/pje-presente.html", grupo: "MS", lote: 3 }
];

async function testarAlvo(alvo) {
    const controlador = new AbortController();
    const idTimeout = setTimeout(() => controlador.abort(), 4500); // 4.5 segundos limite
    const inicio = Date.now();

    try {
        const resposta = await fetch(alvo.url, {
            method: 'GET',
            mode: 'no-cors',
            signal: controlador.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        clearTimeout(idTimeout);
        const latencia = Date.now() - inicio;

        // Se a latência passar de 2.5s classifica como lentidão interna
        const statusFinal = latencia > 2500 ? "Lentidão" : "Online";

        return {
            id: alvo.id,
            nome: alvo.nome,
            grupo: alvo.grupo,
            status: statusFinal,
            latenciaMs: latencia,
            codigoHttp: resposta.status || 200,
            lote: alvo.lote
        };
    } catch (erro) {
        clearTimeout(idTimeout);
        return {
            id: alvo.id,
            nome: alvo.nome,
            grupo: alvo.grupo,
            status: "Fora do Ar",
            latenciaMs: null,
            erro: erro.name === 'AbortError' ? 'The operation was aborted due to timeout' : 'fetch failed',
            lote: alvo.lote
        };
    }
}

export default async function handler(req, res) {
    // Recupera o parâmetro ?lote=X da requisição
    const { lote } = req.query;
    const numLote = parseInt(lote) || 1;

    // Filtra apenas os tribunais mapeados para o lote atual
    const alvosDoLote = tribunais.filter(t => t.lote === numLote);

    if (alvosDoLote.length === 0) {
        return res.status(400).json({ erro: "Lote inválido fornecido." });
    }

    // Dispara as consultas paralelas e limpas no servidor
    const promessas = alvosDoLote.map(alvo => testarAlvo(alvo));
    const resultados = await Promise.all(promessas);

    // Devolve o JSON limpo
    return res.status(200).json(resultados);
}
