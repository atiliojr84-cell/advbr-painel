// api/alvos.js - Base de Dados Completa ADVBR.info
const tribunais = [

    // ==========================================
    // TRIBUNAIS SUPERIORES E NACIONAIS
    // grupo: "nacionais" — botão azul do topo
    // ==========================================
    { id: "pje_cnj",   nome: "PJe Nacional (CNJ)",  url: "https://www.pje.jus.br/navegador/",                grupo: "nacionais", lote: 1 },
    { id: "stj",       nome: "STJ - Processos",      url: "https://www.stj.jus.br/sites/portalp/inicio",     grupo: "nacionais", lote: 1 },
    { id: "stf",       nome: "STF - Eletrônico",     url: "https://portal.stf.jus.br/",                      grupo: "nacionais", lote: 1 },
    { id: "tse",       nome: "TSE - Portal",         url: "https://www.tse.jus.br/",                         grupo: "nacionais", lote: 1 },
    { id: "tst",       nome: "TST - Portal",         url: "https://www.tst.jus.br/",                         grupo: "nacionais", lote: 1 },
    { id: "stm",       nome: "STM - Portal",         url: "https://www.stm.jus.br/",                         grupo: "nacionais", lote: 1 },

    // ==========================================
    // ACRE — AC
    // ==========================================
    { id: "tjac_pje",    nome: "TJAC - PJe",            url: "https://pje.tjac.jus.br/pje/login.seam",          grupo: "AC", lote: 1 },
    { id: "trt14_1g_ac", nome: "TRT14 (AC) - 1º Grau",  url: "https://pje.trt14.jus.br/pje/pje-presente.html",  grupo: "AC", lote: 2 },
    { id: "trt14_2g_ac", nome: "TRT14 (AC) - 2º Grau",  url: "https://pje.trt14.jus.br/pje2g/pje-presente.html",grupo: "AC", lote: 2 },

    // ==========================================
    // ALAGOAS — AL
    // ==========================================
    { id: "tjal_saj",    nome: "TJAL - SAJ",             url: "https://esaj.tjal.jus.br/",                       grupo: "AL", lote: 1 },
    { id: "trt19_1g",    nome: "TRT19 (AL) - 1º Grau",   url: "https://pje.trt19.jus.br/pje/pje-presente.html",  grupo: "AL", lote: 3 },
    { id: "trt19_2g",    nome: "TRT19 (AL) - 2º Grau",   url: "https://pje.trt19.jus.br/pje2g/pje-presente.html",grupo: "AL", lote: 3 },

    // ==========================================
    // AMAZONAS — AM
    // ==========================================
    { id: "tjam_pje",    nome: "TJAM - PJe",             url: "https://pje.tjam.jus.br/pje/login.seam",          grupo: "AM", lote: 1 },
    { id: "trt11_1g",    nome: "TRT11 (AM/RR) - 1º Grau",url: "https://pje.trt11.jus.br/pje/pje-presente.html",  grupo: "AM", lote: 2 },
    { id: "trt11_2g",    nome: "TRT11 (AM/RR) - 2º Grau",url: "https://pje.trt11.jus.br/pje2g/pje-presente.html",grupo: "AM", lote: 2 },

    // ==========================================
    // AMAPÁ — AP
    // ==========================================
    { id: "tjap_tucujuris", nome: "TJAP - Tucujuris",    url: "https://tucujuris.tjap.jus.br/tucujuris/login",   grupo: "AP", lote: 1 },
    { id: "trt8_1g_ap",     nome: "TRT8 (PA/AP) - 1º Grau", url: "https://pje.trt8.jus.br/pje/pje-presente.html",  grupo: "AP", lote: 2 },
    { id: "trt8_2g_ap",     nome: "TRT8 (PA/AP) - 2º Grau", url: "https://pje.trt8.jus.br/pje2g/pje-presente.html",grupo: "AP", lote: 2 },

    // ==========================================
    // BAHIA — BA
    // ==========================================
    { id: "tjba_eproc",  nome: "TJBA - eproc",           url: "https://eproc.tjba.jus.br/",                     grupo: "BA", lote: 1 },
    { id: "trt5_1g",     nome: "TRT5 (BA) - 1º Grau",    url: "https://pje.trt5.jus.br/pje/pje-presente.html",  grupo: "BA", lote: 1 },
    { id: "trt5_2g",     nome: "TRT5 (BA) - 2º Grau",    url: "https://pje.trt5.jus.br/pje2g/pje-presente.html",grupo: "BA", lote: 1 },

    // ==========================================
    // CEARÁ — CE
    // ==========================================
    { id: "tjce_saj",    nome: "TJCE - SAJ",              url: "https://esaj.tjce.jus.br/",                      grupo: "CE", lote: 1 },
    { id: "trt7_1g",     nome: "TRT7 (CE) - 1º Grau",    url: "https://pje.trt7.jus.br/pje/pje-presente.html",  grupo: "CE", lote: 2 },
    { id: "trt7_2g",     nome: "TRT7 (CE) - 2º Grau",    url: "https://pje.trt7.jus.br/pje2g/pje-presente.html",grupo: "CE", lote: 2 },

    // ==========================================
    // DISTRITO FEDERAL — DF
    // ==========================================
    { id: "tjdft_pje",   nome: "TJDFT - PJe",            url: "https://pje.tjdft.jus.br/pje/login.seam",        grupo: "DF", lote: 1 },
    { id: "trt10_1g",    nome: "TRT10 (DF/TO) - 1º Grau",url: "https://pje.trt10.jus.br/pje/pje-presente.html", grupo: "DF", lote: 2 },
    { id: "trt10_2g",    nome: "TRT10 (DF/TO) - 2º Grau",url: "https://pje.trt10.jus.br/pje2g/pje-presente.html",grupo: "DF", lote: 2 },

    // ==========================================
    // ESPÍRITO SANTO — ES
    // ==========================================
    { id: "tjes_pje",    nome: "TJES - PJe",             url: "https://pje.tjes.jus.br/pje/login.seam",         grupo: "ES", lote: 1 },
    { id: "trt17_1g",    nome: "TRT17 (ES) - 1º Grau",   url: "https://pje.trt17.jus.br/pje/pje-presente.html", grupo: "ES", lote: 3 },
    { id: "trt17_2g",    nome: "TRT17 (ES) - 2º Grau",   url: "https://pje.trt17.jus.br/pje2g/pje-presente.html",grupo: "ES", lote: 3 },

    // ==========================================
    // GOIÁS — GO
    // ==========================================
    { id: "tjgo_pje",    nome: "TJGO - PJe",             url: "https://pje.tjgo.jus.br/pje/login.seam",         grupo: "GO", lote: 2 },
    { id: "trt18_1g",    nome: "TRT18 (GO) - 1º Grau",   url: "https://pje.trt18.jus.br/pje/pje-presente.html", grupo: "GO", lote: 3 },
    { id: "trt18_2g",    nome: "TRT18 (GO) - 2º Grau",   url: "https://pje.trt18.jus.br/pje2g/pje-presente.html",grupo: "GO", lote: 3 },

    // ==========================================
    // MARANHÃO — MA
    // ==========================================
    { id: "tjma_pje",    nome: "TJMA - PJe",             url: "https://pje.tjma.jus.br/pje/login.seam",         grupo: "MA", lote: 2 },
    { id: "trt16_1g",    nome: "TRT16 (MA) - 1º Grau",   url: "https://pje.trt16.jus.br/pje/pje-presente.html", grupo: "MA", lote: 3 },
    { id: "trt16_2g",    nome: "TRT16 (MA) - 2º Grau",   url: "https://pje.trt16.jus.br/pje2g/pje-presente.html",grupo: "MA", lote: 3 },

    // ==========================================
    // MINAS GERAIS — MG
    // ==========================================
    { id: "tjmg_pje",    nome: "TJMG - PJe",             url: "https://pje.tjmg.jus.br/pje/login.seam",         grupo: "MG", lote: 2 },
    { id: "trt3_1g",     nome: "TRT3 (MG) - 1º Grau",    url: "https://pje.trt3.jus.br/pje/pje-presente.html",  grupo: "MG", lote: 1 },
    { id: "trt3_2g",     nome: "TRT3 (MG) - 2º Grau",    url: "https://pje.trt3.jus.br/pje2g/pje-presente.html",grupo: "MG", lote: 1 },

    // ==========================================
    // MATO GROSSO DO SUL — MS
    // ==========================================
    { id: "tjms_saj",    nome: "TJMS - SAJ",              url: "https://esaj.tjms.jus.br/",                      grupo: "MS", lote: 2 },
    { id: "trt24_1g",    nome: "TRT24 (MS) - 1º Grau",   url: "https://pje.trt24.jus.br/pje/pje-presente.html", grupo: "MS", lote: 3 },
    { id: "trt24_2g",    nome: "TRT24 (MS) - 2º Grau",   url: "https://pje.trt24.jus.br/pje2g/pje-presente.html",grupo: "MS", lote: 3 },

    // ==========================================
    // MATO GROSSO — MT
    // ==========================================
    { id: "tjmt_pje",    nome: "TJMT - PJe",             url: "https://pje.tjmt.jus.br/pje/login.seam",         grupo: "MT", lote: 2 },
    { id: "trt23_1g",    nome: "TRT23 (MT) - 1º Grau",   url: "https://pje.trt23.jus.br/pje/pje-presente.html", grupo: "MT", lote: 3 },
    { id: "trt23_2g",    nome: "TRT23 (MT) - 2º Grau",   url: "https://pje.trt23.jus.br/pje2g/pje-presente.html",grupo: "MT", lote: 3 },

    // ==========================================
    // PARÁ — PA
    // ==========================================
    { id: "tjpa_pje",    nome: "TJPA - PJe",             url: "https://pje.tjpa.jus.br/pje/login.seam",         grupo: "PA", lote: 2 },
    { id: "trt8_1g",     nome: "TRT8 (PA/AP) - 1º Grau", url: "https://pje.trt8.jus.br/pje/pje-presente.html",  grupo: "PA", lote: 2 },
    { id: "trt8_2g",     nome: "TRT8 (PA/AP) - 2º Grau", url: "https://pje.trt8.jus.br/pje2g/pje-presente.html",grupo: "PA", lote: 2 },

    // ==========================================
    // PARAÍBA — PB
    // ==========================================
    { id: "tjpb_pje",    nome: "TJPB - PJe",             url: "https://pje.tjpb.jus.br/pje/login.seam",         grupo: "PB", lote: 2 },
    { id: "trt13_1g",    nome: "TRT13 (PB) - 1º Grau",   url: "https://pje.trt13.jus.br/pje/pje-presente.html", grupo: "PB", lote: 2 },
    { id: "trt13_2g",    nome: "TRT13 (PB) - 2º Grau",   url: "https://pje.trt13.jus.br/pje2g/pje-presente.html",grupo: "PB", lote: 2 },

    // ==========================================
    // PERNAMBUCO — PE
    // ==========================================
    { id: "tjpe_pje",    nome: "TJPE - PJe",             url: "https://pje.tjpe.jus.br/pje/login.seam",         grupo: "PE", lote: 3 },
    { id: "trt6_1g",     nome: "TRT6 (PE) - 1º Grau",    url: "https://pje.trt6.jus.br/pje/pje-presente.html",  grupo: "PE", lote: 1 },
    { id: "trt6_2g",     nome: "TRT6 (PE) - 2º Grau",    url: "https://pje.trt6.jus.br/pje2g/pje-presente.html",grupo: "PE", lote: 1 },

    // ==========================================
    // PIAUÍ — PI
    // ==========================================
    { id: "tjpi_pje",    nome: "TJPI - PJe",             url: "https://pje.tjpi.jus.br/pje/login.seam",         grupo: "PI", lote: 3 },
    { id: "trt22_1g",    nome: "TRT22 (PI) - 1º Grau",   url: "https://pje.trt22.jus.br/pje/pje-presente.html", grupo: "PI", lote: 3 },
    { id: "trt22_2g",    nome: "TRT22 (PI) - 2º Grau",   url: "https://pje.trt22.jus.br/pje2g/pje-presente.html",grupo: "PI", lote: 3 },

    // ==========================================
    // PARANÁ — PR  ← foco principal do site
    // ==========================================
    { id: "tjpr_eproc",   nome: "TJPR - eproc",          url: "https://eproc.tjpr.jus.br/eproc_2g/",            grupo: "PR", lote: 1 },
    { id: "tjpr_projudi", nome: "TJPR - Projudi",         url: "https://projudi.tjpr.jus.br/projudi/",           grupo: "PR", lote: 1 },
    { id: "trt9_1g",      nome: "TRT9 (PR) - 1º Grau",   url: "https://pje.trt9.jus.br/pje/pje-presente.html",  grupo: "PR", lote: 1 },
    { id: "trt9_2g",      nome: "TRT9 (PR) - 2º Grau",   url: "https://pje.trt9.jus.br/pje2g/pje-presente.html",grupo: "PR", lote: 1 },
    { id: "trf4_pr",      nome: "TRF4 - Federal PR",      url: "https://eproc.trf4.jus.br/eproc2trf4/",          grupo: "PR", lote: 1 },

    // ==========================================
    // RIO DE JANEIRO — RJ
    // ==========================================
    { id: "tjrj_eproc",  nome: "TJRJ - eproc",           url: "https://eproc.tjrj.jus.br/",                     grupo: "RJ", lote: 3 },
    { id: "trt1_1g",     nome: "TRT1 (RJ) - 1º Grau",    url: "https://pje.trt1.jus.br/pje/pje-presente.html",  grupo: "RJ", lote: 1 },
    { id: "trt1_2g",     nome: "TRT1 (RJ) - 2º Grau",    url: "https://pje.trt1.jus.br/pje2g/pje-presente.html",grupo: "RJ", lote: 1 },

    // ==========================================
    // RIO GRANDE DO NORTE — RN
    // ==========================================
    { id: "tjrn_pje",    nome: "TJRN - PJe",             url: "https://pje.tjrn.jus.br/pje/login.seam",         grupo: "RN", lote: 3 },
    { id: "trt21_1g",    nome: "TRT21 (RN) - 1º Grau",   url: "https://pje.trt21.jus.br/pje/pje-presente.html", grupo: "RN", lote: 3 },
    { id: "trt21_2g",    nome: "TRT21 (RN) - 2º Grau",   url: "https://pje.trt21.jus.br/pje2g/pje-presente.html",grupo: "RN", lote: 3 },

    // ==========================================
    // RONDÔNIA — RO
    // ==========================================
    { id: "tjro_pje",    nome: "TJRO - PJe",             url: "https://pje.tjro.jus.br/pje/login.seam",         grupo: "RO", lote: 3 },
    { id: "trt14_1g",    nome: "TRT14 (RO/AC) - 1º Grau",url: "https://pje.trt14.jus.br/pje/pje-presente.html", grupo: "RO", lote: 2 },
    { id: "trt14_2g",    nome: "TRT14 (RO/AC) - 2º Grau",url: "https://pje.trt14.jus.br/pje2g/pje-presente.html",grupo: "RO", lote: 2 },

    // ==========================================
    // RORAIMA — RR
    // ==========================================
    { id: "tjrr_projudi",nome: "TJRR - Projudi",          url: "https://projudi.tjrr.jus.br/projudi/",           grupo: "RR", lote: 3 },
    { id: "trt11_1g_rr", nome: "TRT11 (AM/RR) - 1º Grau",url: "https://pje.trt11.jus.br/pje/pje-presente.html", grupo: "RR", lote: 2 },
    { id: "trt11_2g_rr", nome: "TRT11 (AM/RR) - 2º Grau",url: "https://pje.trt11.jus.br/pje2g/pje-presente.html",grupo: "RR", lote: 2 },

    // ==========================================
    // RIO GRANDE DO SUL — RS
    // ==========================================
    { id: "tjrs_eproc",  nome: "TJRS - eproc",           url: "https://eproc.tjrs.jus.br/eproc/",               grupo: "RS", lote: 3 },
    { id: "trt4_1g",     nome: "TRT4 (RS) - 1º Grau",    url: "https://pje.trt4.jus.br/pje/pje-presente.html",  grupo: "RS", lote: 1 },
    { id: "trt4_2g",     nome: "TRT4 (RS) - 2º Grau",    url: "https://pje.trt4.jus.br/pje2g/pje-presente.html",grupo: "RS", lote: 1 },

    // ==========================================
    // SANTA CATARINA — SC
    // ==========================================
    { id: "tjsc_eproc",  nome: "TJSC - eproc",           url: "https://eproc2g.tjsc.jus.br/eproc/",             grupo: "SC", lote: 3 },
    { id: "trt12_1g",    nome: "TRT12 (SC) - 1º Grau",   url: "https://pje.trt12.jus.br/pje/pje-presente.html", grupo: "SC", lote: 2 },
    { id: "trt12_2g",    nome: "TRT12 (SC) - 2º Grau",   url: "https://pje.trt12.jus.br/pje2g/pje-presente.html",grupo: "SC", lote: 2 },

    // ==========================================
    // SERGIPE — SE
    // ==========================================
    { id: "tjse_portal", nome: "TJSE - Portal",           url: "https://www.tjse.jus.br/portaltj/",              grupo: "SE", lote: 3 },
    { id: "trt20_1g",    nome: "TRT20 (SE) - 1º Grau",   url: "https://pje.trt20.jus.br/pje/pje-presente.html", grupo: "SE", lote: 3 },
    { id: "trt20_2g",    nome: "TRT20 (SE) - 2º Grau",   url: "https://pje.trt20.jus.br/pje2g/pje-presente.html",grupo: "SE", lote: 3 },

    // ==========================================
    // SÃO PAULO — SP
    // ==========================================
    { id: "tjsp_saj",    nome: "TJSP - e-SAJ",            url: "https://esaj.tjsp.jus.br/",                      grupo: "SP", lote: 3 },
    { id: "trt2_1g",     nome: "TRT2 (SP Cap.) - 1º Grau",url: "https://pje.trtsp.jus.br/pje/pje-presente.html", grupo: "SP", lote: 1 },
    { id: "trt2_2g",     nome: "TRT2 (SP Cap.) - 2º Grau",url: "https://pje.trtsp.jus.br/pje2g/pje-presente.html",grupo: "SP", lote: 1 },
    { id: "trt15_1g",    nome: "TRT15 (SP Camp.) - 1º Grau",url: "https://pje.trt15.jus.br/pje/pje-presente.html",grupo: "SP", lote: 2 },
    { id: "trt15_2g",    nome: "TRT15 (SP Camp.) - 2º Grau",url: "https://pje.trt15.jus.br/pje2g/pje-presente.html",grupo: "SP", lote: 2 },
    { id: "trf3",        nome: "TRF3 - Federal SP/MS",    url: "https://pje1g.trf3.jus.br/pje/",                 grupo: "SP", lote: 1 },

    // ==========================================
    // TOCANTINS — TO
    // ==========================================
    { id: "tjto_eproc",  nome: "TJTO - eproc",           url: "https://eproc.tjto.jus.br/eprocV2/",             grupo: "TO", lote: 3 },
    { id: "trt10_1g_to", nome: "TRT10 (DF/TO) - 1º Grau",url: "https://pje.trt10.jus.br/pje/pje-presente.html", grupo: "TO", lote: 2 },
    { id: "trt10_2g_to", nome: "TRT10 (DF/TO) - 2º Grau",url: "https://pje.trt10.jus.br/pje2g/pje-presente.html",grupo: "TO", lote: 2 },

];

export default tribunais;
