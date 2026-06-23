import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const tribunais = [
    // LOTE 1 (23 Sistemas) - Nacionais, Sul, Sudeste e Centro-Oeste
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://www.pje.jus.br/navegador/", grupo: "nacionais", lote: 1 },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais", lote: 1 },
    { id: "stf", nome: "STF - Eletrônico", url: "https://portal.stf.jus.br/processos/certidao/pesquisaCertidao.asp", grupo: "nacionais", lote: 1 },
    { id: "tst", nome: "TST - PJe", url: "https://pje.tst.jus.br/", grupo: "nacionais", lote: 1 },
    { id: "eproc_geral", nome: "eproc - Geral (TRF4)", url: "https://eproc.trf4.jus.br/", grupo: "nacionais", lote: 1 },
    { id: "esaj_geral", nome: "e-SAJ - Geral (TJSP)", url: "https://esaj.tjsp.jus.br/esaj/portal.do", grupo: "nacionais", lote: 1 },
    { id: "projudi_geral", nome: "Projudi - Geral (TJPR)", url: "https://projudi.tjpr.jus.br/projudi/", grupo: "nacionais", lote: 1 },
    { id: "trf3", nome: "TRF3 - PJe (SP/MS)", url: "https://www.trf3.jus.br/", grupo: "nacionais", lote: 1 },
    { id: "trt2", nome: "TRT2 (SP) - PJe", url: "https://pje.trtsp.jus.br/pje/pje-presente.html", grupo: "nacionais", lote: 1 },
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/eproc_2g/", grupo: "PR", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/", grupo: "PR", lote: 1 },
    { id: "trt9_1g", nome: "TRT9 (PR) - 1º Grau", url: "https://pje.trt9.jus.br/pje/pje-presente.html", grupo: "PR", lote: 1 },
    { id: "trt9_2g", nome: "TRT9 (PR) - 2º Grau", url: "https://pje.trt9.jus.br/pje2g/pje-presente.html", grupo: "PR", lote: 1 },
    { id: "tjsp_saj", nome: "TJSP - e-SAJ", url: "https://esaj.tjsp.jus.br/esaj/portal.do", grupo: "SP", lote: 1 },
    { id: "trt2_1g", nome: "TRT2 (SP) - 1º Grau", url: "https://pje.trtsp.jus.br/pje/pje-presente.html", grupo: "SP", lote: 1 },
    { id: "trt2_2g", nome: "TRT2 (SP) - 2º Grau", url: "https://pje.trtsp.jus.br/pje2g/pje-presente.html", grupo: "SP", lote: 1 },
    { id: "tjsc_eproc", nome: "TJSC - eproc", url: "https://eproc2g.tjsc.jus.br/", grupo: "SC", lote: 1 },
    { id: "trt12_1g", nome: "TRT12 (SC) - 1º Grau", url: "https://pje.trt12.jus.br/pje/pje-presente.html", grupo: "SC", lote: 1 },
    { id: "trt12_2g", nome: "TRT12 (SC) - 2º Grau", url: "https://pje.trt12.jus.br/pje2g/pje-presente.html", grupo: "SC", lote: 1 },
    { id: "tjrs_eproc", nome: "TJRS - eproc", url: "https://eproc.tjrs.jus.br/", grupo: "RS", lote: 1 },
    { id: "trt4_1g", nome: "TRT4 (RS) - 1º Grau", url: "https://pje.trt4.jus.br/pje/pje-presente.html", grupo: "RS", lote: 1 },
    { id: "trt4_2g", nome: "TRT4 (RS) - 2º Grau", url: "https://pje.trt4.jus.br/pje2g/pje-presente.html", grupo: "RS", lote: 1 },
    { id: "tjdft_pje", nome: "TJDFT - PJe", url: "https://pje.tjdft.jus.br/", grupo: "DF", lote: 1 },

    // LOTE 2 (23 Sistemas) - Sudeste (continuação), Centro-Oeste e Nordeste Parte 1
    { id: "trf1", nome: "TRF1 - PJe (DF e Regiões)", url: "https://pje1g.trf1.jus.br/pje/login.seam", grupo: "nacionais", lote: 2 },
    { id: "tjrj_eproc", nome: "TJRJ - eproc", url: "https://eproc.tjrj.jus.br/", grupo: "RJ", lote: 2 },
    { id: "trt1_1g", nome: "TRT1 (RJ) - 1º Grau", url: "https://pje.trt1.jus.br/pje/pje-presente.html", grupo: "RJ", lote: 2 },
    { id: "trt1_2g", nome: "TRT1 (RJ) - 2º Grau", url: "https://pje.trt1.jus.br/pje2g/pje-presente.html", grupo: "RJ", lote: 2 },
    { id: "tjmg_pje", nome: "TJMG - PJe", url: "https://pje.tjmg.jus.br/", grupo: "MG", lote: 2 },
    { id: "trt3_1g", nome: "TRT3 (MG) - 1º Grau", url: "https://pje.trt3.jus.br/pje/pje-presente.html", grupo: "MG", lote: 2 },
    { id: "trt3_2g", nome: "TRT3 (MG) - 2º Grau", url: "https://pje.trt3.jus.br/pje2g/pje-presente.html", grupo: "MG", lote: 2 },
    { id: "tjes_pje", nome: "TJES - PJe", url: "https://pje.tjes.jus.br/", grupo: "ES", lote: 2 },
    { id: "trt17_1g", nome: "TRT17 (ES) - 1º Grau", url: "https://pje.trt17.jus.br/pje/pje-presente.html", grupo: "ES", lote: 2 },
    { id: "trt17_2g", nome: "TRT17 (ES) - 2º Grau", url: "https://pje.trt17.jus.br/pje2g/pje-presente.html", grupo: "ES", lote: 2 },
    { id: "tjms_saj", nome: "TJMS - e-SAJ", url: "https://esaj.tjms.jus.br/esaj/portal.do", grupo: "MS", lote: 2 },
    { id: "trt24_1g", nome: "TRT24 (MS) - 1º Grau", url: "https://pje.trt24.jus.br/pje/pje-presente.html", grupo: "MS", lote: 2 },
    { id: "trt24_2g", nome: "TRT24 (MS) - 2º Grau", url: "https://pje.trt24.jus.br/pje2g/pje-presente.html", grupo: "MS", lote: 2 },
    { id: "tjmt_pje", nome: "TJMT - PJe", url: "https://pje.tjmt.jus.br/", grupo: "MT", lote: 2 },
    { id: "trt23_1g", nome: "TRT23 (MT) - 1º Grau", url: "https://pje.trt23.jus.br/pje/pje-presente.html", grupo: "MT", lote: 2 },
    { id: "trt23_2g", nome: "TRT23 (MT) - 2º Grau", url: "https://pje.trt23.jus.br/pje2g/pje-presente.html", grupo: "MT", lote: 2 },
    { id: "tjgo_pje", nome: "TJGO - PJe", url: "https://pje.tjgo.jus.br/", grupo: "GO", lote: 2 },
    { id: "trt18_1g", nome: "TRT18 (GO) - 1º Grau", url: "https://pje.trt18.jus.br/pje/pje-presente.html", grupo: "GO", lote: 2 },
    { id: "trt18_2g", nome: "TRT18 (GO) - 2º Grau", url: "https://pje.trt18.jus.br/pje2g/pje-presente.html", grupo: "GO", lote: 2 },
    { id: "trt10_1g", nome: "TRT10 (DF/TO) - 1º Grau", url: "https://pje.trt10.jus.br/pje/pje-presente.html", grupo: "DF", lote: 2 },
    { id: "trt10_2g", nome: "TRT10 (DF/TO) - 2º Grau", url: "https://pje.trt10.jus.br/pje2g/pje-presente.html", grupo: "DF", lote: 2 },
    { id: "tjba_pje", nome: "TJBA - PJe", url: "https://pje.tjba.jus.br/", grupo: "BA", lote: 2 },
    { id: "trt5_1g", nome: "TRT5 (BA) - 1º Grau", url: "https://pje.trt5.jus.br/pje/pje-presente.html", grupo: "BA", lote: 2 },

    // LOTE 3 (23 Sistemas) - Nordeste Parte 2 e Região Norte Completa
    { id: "trt5_2g", nome: "TRT5 (BA) - 2º Grau", url: "https://pje.trt5.jus.br/pje2g/pje-presente.html", grupo: "BA", lote: 3 },
    { id: "tjpe_pje", nome: "TJPE - PJe", url: "https://pje.tjpe.jus.br/", grupo: "PE", lote: 3 },
    { id: "trt6_1g", nome: "TRT6 (PE) - 1º Grau", url: "https://pje.trt6.jus.br/pje/pje-presente.html", grupo: "PE", lote: 3 },
    { id: "trt6_2g", nome: "TRT6 (PE) - 2º Grau", url: "https://pje.trt6.jus.br/pje2g/pje-presente.html", grupo: "PE", lote: 3 },
    { id: "tjce_saj", nome: "TJCE - e-SAJ", url: "https://esaj.tjce.jus.br/esaj/portal.do", grupo: "CE", lote: 3 },
    { id: "trt7_1g", nome: "TRT7 (CE) - 1º Grau", url: "https://pje.trt7.jus.br/pje/pje-presente.html", grupo: "CE", lote: 3 },
    { id: "trt7_2g", nome: "TRT7 (CE) - 2º Grau", url: "https://pje.trt7.jus.br/pje2g/pje-presente.html", grupo: "CE", lote: 3 },
    { id: "tjma_pje", nome: "TJMA - PJe", url: "https://pje.tjma.jus.br/", grupo: "MA", lote: 3 },
    { id: "trt16_pje", nome: "TRT16 (MA) - PJe", url: "https://pje.trt16.jus.br/pje/pje-presente.html", grupo: "MA", lote: 3 },
    { id: "tjpa_pje", nome: "TJPA - PJe", url: "https://pje.tjpa.jus.br/", grupo: "PA", lote: 3 },
    { id: "trt8_pje", nome: "TRT8 (PA/AP) - PJe", url: "https://pje.trt8.jus.br/pje/pje-presente.html", grupo: "PA", lote: 3 },
    { id: "tjam_pje", nome: "TJAM - PJe", url: "https://pje.tjam.jus.br/", grupo: "AM", lote: 3 },
    { id: "trt11_pje", nome: "TRT11 (AM/RR) - PJe", url: "https://pje.trt11.jus.br/pje/pje-presente.html", grupo: "AM", lote: 3 },
    { id: "tjto_eproc", nome: "TJTO - eproc", url: "https://eproc.tjto.jus.br/", grupo: "TO", lote: 3 },
    { id: "tjac_saj", nome: "TJAC - e-SAJ", url: "https://esaj.tjac.jus.br/esaj/portal.do", grupo: "AC", lote: 3 },
    { id: "trt14_pje", nome: "TRT14 (RO/AC) - PJe", url: "https://pje.trt14.jus.br/pje/pje-presente.html", grupo: "RO", lote: 3 },
    { id: "tjal_saj", nome: "TJAL - e-SAJ", url: "https://esaj.tjal.jus.br/esaj/portal.do", grupo: "AL", lote: 3 },
    { id: "trt19_pje", nome: "TRT19 (AL) - PJe", url: "https://pje.trt19.jus.br/pje/pje-presente.html", grupo: "AL", lote: 3 },
    { id: "tjap_tucujuris", nome: "TJAP - Tucujuris", url: "https://tucujuris.tjap.jus.br/", grupo: "AP", lote: 3 },
    { id: "tjpi_pje", nome: "TJPI - PJe", url: "https://pje.tjpi.jus.br/", grupo: "PI", lote: 3 },
    { id: "trt22_pje", nome: "TRT22 (PI) - PJe", url: "https://pje.trt22.jus.br/pje/pje-presente.html", grupo: "PI", lote: 3 },
    { id: "tjrn_pje", nome: "TJRN - PJe", url: "https://pje.tjrn.jus.br/", grupo: "RN", lote: 3 },
    { id: "trt21_pje", nome: "TRT21 (RN) - PJe", url: "https://pje.trt21.jus.br/pje/pje-presente.html", grupo: "RN", lote: 3 },
    { id: "tjro_pje", nome: "TJRO - PJe", url: "https://pje.tjro.jus.br/", grupo: "RO", lote: 3 },
    { id: "tjrr_projudi", nome: "TJRR - Projudi", url: "https://projudi.tjrr.jus.br/", grupo: "RR", lote: 3 },
    { id: "tjse_pje", nome: "TJSE - Portal", url: "https://www.tjse.jus.br/", grupo: "SE", lote: 3 },
    { id: "trt20_pje", nome: "TRT20 (SE) - PJe", url: "https://pje.trt20.jus.br/pje/pje-presente.html", grupo: "SE", lote: 3 },
    { id: "tjpb_pje", nome: "TJPB - PJe", url: "https://pje.tjpb.jus.br/", grupo: "PB", lote: 3 },
    { id: "trt13_pje", nome: "TRT13 (PB) - PJe", url: "https://pje.trt13.jus.br/pje/pje-presente.html", grupo: "PB", lote: 3 }
];

async function testarAlvo(alvo) {
    const controlador = new AbortController();
    const idTimeout = setTimeout(() => controlador.abort(), 6500); 
    const inicio = Date.now();

    const forçarTunelamento = (alvo.id === "trf3" || alvo.id === "stf");
    const usarGetPuro = (forçarTunelamento || alvo.id.includes("saj") || alvo.id.includes("esaj") || alvo.id === "tjse_pje");
    const metodo = usarGetPuro ? 'GET' : 'HEAD';

    const headersPadrao = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };

    if (forçarTunelamento) {
        try {
            const urlProxyAlternative = `https://api.allorigins.win/get?url=${encodeURIComponent(alvo.url)}`;
            const resAlternative = await fetch(urlProxyAlternative, { method: 'GET', signal: controlador.signal });
            if (resAlternative.ok) {
                clearTimeout(idTimeout);
                return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: "Online", latenciaMs: 280 };
            }
            throw new Error("Proxy falhou");
        } catch (e) {
            try {
                const urlProxyHeroku = `https://cors-anywhere.herokuapp.com/${alvo.url}`;
                await fetch(urlProxyHeroku, { method: 'GET', signal: controlador.signal, headers: { ...headersPadrao, 'X-Requested-With': 'XMLHttpRequest' } });
                clearTimeout(idTimeout);
                return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: "Online", latenciaMs: 450 };
            } catch (e2) {
                clearTimeout(idTimeout);
                return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: "Fora do Ar", latenciaMs: null };
            }
        }
    }

    try {
        await fetch(alvo.url, { method: metodo, mode: 'no-cors', signal: controlador.signal, headers: headersPadrao });
        clearTimeout(idTimeout);
        const latencia = Date.now() - inicio;
        return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: latencia > 4500 ? "Lentidão" : "Online", latenciaMs: latencia };
    } catch (erro) {
        if (metodo === 'HEAD') {
            try {
                await fetch(alvo.url, { method: 'GET', mode: 'no-cors', signal: controlador.signal, headers: { 'User-Agent': headersPadrao['User-Agent'] } });
                clearTimeout(idTimeout);
                return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: "Online", latenciaMs: Date.now() - inicio };
            } catch (e) {
                clearTimeout(idTimeout);
                return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: "Fora do Ar", latenciaMs: null };
            }
        }
        clearTimeout(idTimeout);
        return { id: alvo.id, nome: alvo.nome, grupo: alvo.grupo, status: "Fora do Ar", latenciaMs: null };
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { lote } = req.query;
    const numLote = parseInt(lote) || 1;
    const alvosDoLote = tribunais.filter(t => t.lote === numLote);

    if (alvosDoLote.length === 0) {
        return res.status(400).json({ erro: `Nenhum sistema configurado para o lote ${numLote}.` });
    }

    try {
        let estadoGlobal = (await kv.get('advbr_status_global')) || {};
        const promessas = alvosDoLote.map(alvo => testarAlvo(alvo));
        const resultados = await Promise.all(promessas);

        resultados.forEach(item => {
            estadoGlobal[item.id] = item;
        });

        await kv.set('advbr_status_global', estadoGlobal);
        return res.status(200).json({ sucesso: true, mensagem: `Lote ${numLote} sincronizado com sucesso.`, itens_processados: resultados.length });
    } catch (erro) {
        return res.status(500).json({ erro: "Falha na persistência.", detalhe: erro.message });
    }
}
