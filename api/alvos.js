// api/alvos.js - Base de Dados Expandida ADVBR.info
const tribunais = [
    // ==========================================
    // TRIBUNAIS SUPERIORES E NACIONAIS (Botão Nacionais)
    // ==========================================
    { id: "pje_cnj",   nome: "PJe Nacional (CNJ)",  url: "https://www.pje.jus.br/navegador/",                grupo: "nacionais", lote: 1 },
    { id: "stj",       nome: "STJ - Processos",      url: "https://www.stj.jus.br/sites/portalp/inicio",     grupo: "nacionais", lote: 1 },
    { id: "stf",       nome: "STF - Eletrônico",     url: "https://portal.stf.jus.br/",                      grupo: "nacionais", lote: 1 },
    { id: "tse",       nome: "TSE - Portal",         url: "https://www.tse.jus.br/",                         grupo: "nacionais", lote: 1 },
    { id: "tst",       nome: "TST - Portal",         url: "https://www.tst.jus.br/",                         grupo: "nacionais", lote: 1 },
    { id: "stm",       nome: "STM - Portal",         url: "https://www.stm.jus.br/",                         grupo: "nacionais", lote: 1 },

    // ==========================================
    // PARANÁ — PR (Foco Principal - Sem os parênteses no nome)
    // ==========================================
    { id: "tjpr_eproc_1g", nome: "TJPR - eproc 1º Grau",   url: "https://eproc.tjpr.jus.br/eproc_1g/",           grupo: "PR", lote: 1 },
    { id: "tjpr_eproc_2g", nome: "TJPR - eproc 2º Grau",   url: "https://eproc.tjpr.jus.br/eproc_2g/",           grupo: "PR", lote: 1 },
    { id: "tjpr_projudi",  nome: "TJPR - Projudi",         url: "https://projudi.tjpr.jus.br/projudi/",          grupo: "PR", lote: 1 },
    { id: "trt9_1g",       nome: "TRT9 - PJe 1º Grau",     url: "https://pje.trt9.jus.br/pje/pje-presente.html",  grupo: "PR", lote: 1 },
    { id: "trt9_2g",       nome: "TRT9 - PJe 2º Grau",     url: "https://pje.trt9.jus.br/pje2g/pje-presente.html",grupo: "PR", lote: 1 },
    { id: "trf4_pr",       nome: "TRF4 - Federal PR",      url: "https://eproc.trf4.jus.br/eproc2trf4/",         grupo: "PR", lote: 1 },

    // ==========================================
    // SÃO PAULO — SP
    // ==========================================
    { id: "tjsp_saj",      nome: "TJSP - e-SAJ (Login)",   url: "https://esaj.tjsp.jus.br/sajcas/login",         grupo: "SP", lote: 1 },
    { id: "trt2_1g",       nome: "TRT2 (SP) - PJe 1º Grau",url: "https://pje.trtsp.jus.br/pje/pje-presente.html",  grupo: "SP", lote: 1 },
    { id: "trt2_2g",       nome: "TRT2 (SP) - PJe 2º Grau",url: "https://pje.trtsp.jus.br/pje2g/pje-presente.html",grupo: "SP", lote: 1 },
    { id: "trt15_1g",      nome: "TRT15 (Campinas) - 1G",  url: "https://pje.trt15.jus.br/pje/pje-presente.html",grupo: "SP", lote: 2 },
    { id: "trt15_2g",      nome: "TRT15 (Campinas) - 2G",  url: "https://pje.trt15.jus.br/pje2g/pje-presente.html",grupo: "SP", lote: 2 },
    { id: "trf3_1g",       nome: "TRF3 - PJe 1º Grau",     url: "https://pje1g.trf3.jus.br/pje/",                grupo: "SP", lote: 1 },
    { id: "trf3_2g",       nome: "TRF3 - PJe 2º Grau",     url: "https://pje2g.trf3.jus.br/pje/",                grupo: "SP", lote: 1 },

    // ==========================================
    // RIO DE JANEIRO — RJ
    // ==========================================
    { id: "tjrj_eproc",    nome: "TJRJ - eproc",           url: "https://eproc.tjrj.jus.br/",                    grupo: "RJ", lote: 2 },
    { id: "trt1_1g",       nome: "TRT1 (RJ) - PJe 1º Grau",url: "https://pje.trt1.jus.br/pje/pje-presente.html",  grupo: "RJ", lote: 2 },
    { id: "trt1_2g",       nome: "TRT1 (RJ) - PJe 2º Grau",url: "https://pje.trt1.jus.br/pje2g/pje-presente.html",grupo: "RJ", lote: 2 },
    { id: "trf2_1g",       nome: "TRF2 - eproc 1º Grau",   url: "https://eproc.trf2.jus.br/eproc_1g/",           grupo: "RJ", lote: 2 },

    // ==========================================
    // MINAS GERAIS — MG
    // ==========================================
    { id: "tjmg_pje_1g",   nome: "TJMG - PJe 1º Grau",     url: "https://pje.tjmg.jus.br/pje/login.seam",        grupo: "MG", lote: 2 },
    { id: "tjmg_pje_2g",   nome: "TJMG - PJe 2º Grau",     url: "https://pje2g.tjmg.jus.br/pje/login.seam",      grupo: "MG", lote: 2 },
    { id: "trt3_1g",       nome: "TRT3 (MG) - PJe 1º Grau",url: "https://pje.trt3.jus.br/pje/pje-presente.html",  grupo: "MG", lote: 2 },
    { id: "trt3_2g",       nome: "TRT3 (MG) - PJe 2º Grau",url: "https://pje.trt3.jus.br/pje2g/pje-presente.html",grupo: "MG", lote: 2 },

    // ==========================================
    // RIO GRANDE DO SUL — RS
    // ==========================================
    { id: "tjrs_eproc",    nome: "TJRS - eproc",           url: "https://eproc.tjrs.jus.br/eproc/",              grupo: "RS", lote: 2 },
    { id: "trt4_1g",       nome: "TRT4 (RS) - PJe 1º Grau",url: "https://pje.trt4.jus.br/pje/pje-presente.html",  grupo: "RS", lote: 2 },
    { id: "trt4_2g",       nome: "TRT4 (RS) - PJe 2º Grau",url: "https://pje.trt4.jus.br/pje2g/pje-presente.html",grupo: "RS", lote: 2 },

    // ==========================================
    // SANTA CATARINA — SC
    // ==========================================
    { id: "tjsc_eproc",    nome: "TJSC - eproc",           url: "https://eproc2g.tjsc.jus.br/eproc/",            grupo: "SC", lote: 2 },
    { id: "trt12_1g",      nome: "TRT12 (SC) - PJe 1º G",  url: "https://pje.trt12.jus.br/pje/pje-presente.html", grupo: "SC", lote: 2 },
    { id: "trt12_2g",      nome: "TRT12 (SC) - PJe 2º G",  url: "https://pje.trt12.jus.br/pje2g/pje-presente.html",grupo: "SC", lote: 2 },

    // ==========================================
    // DISTRITO FEDERAL — DF
    // ==========================================
    { id: "tjdft_pje",     nome: "TJDFT - PJe (Login)",    url: "https://pje.tjdft.jus.br/pje/login.seam",       grupo: "DF", lote: 3 },
    { id: "trt10_1g",      nome: "TRT10 - PJe 1º Grau",    url: "https://pje.trt10.jus.br/pje/pje-presente.html", group: "DF", lote: 3 },
    { id: "trt10_2g",      nome: "TRT10 - PJe 2º Grau",    url: "https://pje.trt10.jus.br/pje2g/pje-presente.html",grupo: "DF", lote: 3 },

    // ==========================================
    // BAHIA — BA
    // ==========================================
    { id: "tjba_eproc",    nome: "TJBA - eproc",           url: "https://eproc.tjba.jus.br/",                    grupo: "BA", lote: 3 },
    { id: "trt5_1g",       nome: "TRT5 (BA) - PJe 1º Grau",url: "https://pje.trt5.jus.br/pje/pje-presente.html",  grupo: "BA", lote: 3 },
    { id: "trt5_2g",       nome: "TRT5 (BA) - PJe 2º Grau",url: "https://pje.trt5.jus.br/pje2g/pje-presente.html",grupo: "BA", lote: 3 },

    // ==========================================
    // PERNAMBUCO — PE
    // ==========================================
    { id: "tjpe_pje_1g",   nome: "TJPE - PJe 1º Grau",     url: "https://pje.tjpe.jus.br/1g/login.seam",         grupo: "PE", lote: 3 },
    { id: "tjpe_pje_2g",   nome: "TJPE - PJe 2º Grau",     url: "https://pje.tjpe.jus.br/2g/login.seam",         grupo: "PE", lote: 3 },
    { id: "trt6_1g",       nome: "TRT6 (PE) - PJe 1º Grau",url: "https://pje.trt6.jus.br/pje/pje-presente.html",  grupo: "PE", lote: 3 },
    { id: "trt6_2g",       nome: "TRT6 (PE) - PJe 2º Grau",url: "https://pje.trt6.jus.br/pje2g/pje-presente.html",grupo: "PE", lote: 3 },

    // ==========================================
    // DEMAIS ESTADOS
    // ==========================================
    { id: "tjac_pje",      nome: "TJAC - PJe Login",       url: "https://pje.tjac.jus.br/pje/login.seam",        grupo: "AC", lote: 3 },
    { id: "tjal_saj",      nome: "TJAL - e-SAJ Login",     url: "https://esaj.tjal.jus.br/",                     grupo: "AL", lote: 3 },
    { id: "tjam_pje",      nome: "TJAM - PJe Login",       url: "https://pje.tjam.jus.br/pje/login.seam",        grupo: "AM", lote: 3 },
    { id: "tjap_tucu",     nome: "TJAP - Tucujuris",       url: "https://tucujuris.tjap.jus.br/tucujuris/login",  grupo: "AP", lote: 3 },
    { id: "tjce_saj",      nome: "TJCE - e-SAJ Login",     url: "https://esaj.tjce.jus.br/",                     grupo: "CE", lote: 3 },
    { id: "tjes_pje",      nome: "TJES - PJe Login",       url: "https://pje.tjes.jus.br/pje/login.seam",        grupo: "ES", lote: 3 },
    { id: "tjgo_pje",      nome: "TJGO - PJe Login",       url: "https://pje.tjgo.jus.br/pje/login.seam",        grupo: "GO", lote: 3 },
    { id: "tjma_pje",      nome: "TJMA - PJe Login",       url: "https://pje.tjma.jus.br/pje/login.seam",        grupo: "MA", lote: 3 },
    { id: "tjms_saj",      nome: "TJMS - e-SAJ Login",     url: "https://esaj.tjms.jus.br/",                     grupo: "MS", lote: 3 },
    { id: "tjmt_pje",      nome: "TJMT - PJe Login",       url: "https://pje.tjmt.jus.br/pje/login.seam",        grupo: "MT", lote: 3 },
    { id: "tjpa_pje",      nome: "TJPA - PJe Login",       url: "https://pje.tjpa.jus.br/pje/login.seam",        grupo: "PA", lote: 3 },
    { id: "tjpb_pje",      nome: "TJPB - PJe Login",       url: "https://pje.tjpb.jus.br/pje/login.seam",        grupo: "PB", lote: 3 },
    { id: "tjpi_pje",      nome: "TJPI - PJe Login",       url: "https://pje.tjpi.jus.br/pje/login.seam",        grupo: "PI", lote: 3 },
    { id: "tjrn_pje",      nome: "TJRN - PJe Login",       url: "https://pje.tjrn.jus.br/pje/login.seam",        grupo: "RN", lote: 3 },
    { id: "tjro_pje",      nome: "TJRO - PJe Login",       url: "https://pje.tjro.jus.br/pje/login.seam",        grupo: "RO", lote: 3 },
    { id: "tjrr_pro",      nome: "TJRR - Projudi",         url: "https://projudi.tjrr.jus.br/projudi/",          grupo: "RR", lote: 3 },
    { id: "tjse_port",     nome: "TJSE - Portal e-Doc",    url: "https://www.tjse.jus.br/portaltj/",             grupo: "SE", lote: 3 },
    { id: "tjto_eproc",    nome: "TJTO - eproc",           url: "https://eproc.tjto.jus.br/eprocV2/",            grupo: "TO", lote: 3 }
];

export default tribunais;
