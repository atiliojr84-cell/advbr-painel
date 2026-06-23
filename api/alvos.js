// api/alvos.js - Base de Dados Reduzida (Fase Inicial) ADVBR.info
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
    // PARANÁ — PR (Botão Paraná)
    // ==========================================
    { id: "tjpr_eproc_1g", nome: "TJPR - eproc 1º Grau",   url: "https://eproc.tjpr.jus.br/eproc_1g/",           grupo: "PR", lote: 1 },
    { id: "tjpr_eproc_2g", nome: "TJPR - eproc 2º Grau",   url: "https://eproc.tjpr.jus.br/eproc_2g/",           grupo: "PR", lote: 1 },
    { id: "tjpr_projudi",  nome: "TJPR - Projudi",         url: "https://projudi.tjpr.jus.br/projudi/",          grupo: "PR", lote: 1 },
    { id: "trt9_1g",       nome: "TRT9 - PJe 1º Grau",     url: "https://pje.trt9.jus.br/pje/pje-presente.html",  grupo: "PR", lote: 1 },
    { id: "trt9_2g",       nome: "TRT9 - PJe 2º Grau",     url: "https://pje.trt9.jus.br/pje2g/pje-presente.html",grupo: "PR", lote: 1 },
    { id: "trf4_pr",       nome: "TRF4 - Federal PR",      url: "https://eproc.trf4.jus.br/eproc2trf4/",         grupo: "PR", lote: 1 },

    // ==========================================
    // EXTRA SÃO PAULO (Para compor os 10 do Carrossel do topo)
    // ==========================================
    { id: "tjsp_saj",      nome: "TJSP - e-SAJ (Login)",   url: "https://esaj.tjsp.jus.br/sajcas/login",         grupo: "SP", lote: 1 },
    { id: "trf3",          nome: "TRF3 - Federal SP/MS",    url: "https://pje1g.trf3.jus.br/pje/",                 grupo: "SP", lote: 1 }
];

export default tribunais;
