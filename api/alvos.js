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
    // EXTRA SÃO PAULO (Com a URL exata do SSO do TRF3 que você mandou)
    // ==========================================
    { id: "tjsp_saj",      nome: "TJSP - e-SAJ (Login)",   url: "https://esaj.tjsp.jus.br/sajcas/login",         grupo: "SP", lote: 1 },
    { id: "trf3",          nome: "TRF3 - Federal SP/MS",    url: "https://sso.cloud.pje.jus.br/auth/realms/pje/protocol/openid-connect/auth?response_type=code&client_id=pje-trf3-1g&redirect_uri=https%3A%2F%2Fpje1g.trf3.jus.br%2Fpje%2Flogin.seam&state=e653ee0b-f392-47d1-8ef9-207c706b9493&login=true&scope=openid", grupo: "SP", lote: 1 }
];

export default tribunais;
