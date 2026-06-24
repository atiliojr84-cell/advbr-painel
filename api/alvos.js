// api/alvos.js - Base de Dados Reduzida (Fase Inicial) ADVBR.info
const tribunais = [
    // ==========================================
    // SISTEMAS NACIONAIS
    // ==========================================
    { id: "pje_cnj",       nome: "PJe Nacional (CNJ)", sub: "Servidor de Login CNJ",        grupo: "nacionais", lote: 1, url: "https://www.pje.jus.br/navegador/" },

    // ==========================================
    // TRIBUNAIS SUPERIORES
    // ==========================================
    { id: "stj",           nome: "STJ - Processos",    sub: "Superior Tribunal de Justiça", grupo: "superiores", lote: 1, url: "https://www.stj.jus.br/sites/portalp/inicio" },
    { id: "stf",           nome: "STF - Eletrônico",   sub: "Autenticação PKI Login",       grupo: "superiores", lote: 1, url: "https://portal.stf.jus.br/" },
    { id: "tse",           nome: "TSE - Portal",       sub: "Tribunal Superior Eleitoral",  grupo: "superiores", lote: 1, url: "https://www.tse.jus.br/" },
    { id: "tst",           nome: "TST - PJe",          sub: "Tribunal Superior do Trabalho",grupo: "superiores", lote: 1, url: "https://www.tst.jus.br/" },
    { id: "stm",           nome: "STM - Portal",       sub: "Superior Tribunal Militar",    grupo: "superiores", lote: 1, url: "https://www.stm.jus.br/" },

    // ==========================================
    // PARANÁ — PR (Botão Paraná)
    // ==========================================
    { id: "tjpr_eproc_1g", nome: "TJPR - eproc 1º Grau",sub: "Servidor eproc 1º Grau",       grupo: "PR",        lote: 1, url: "https://eproc.tjpr.jus.br/eproc_1g/" },
    { id: "tjpr_eproc_2g", nome: "TJPR - eproc 2º Grau",sub: "Servidor eproc 2º Grau",       grupo: "PR",        lote: 1, url: "https://eproc.tjpr.jus.br/eproc_2g/" },
    { id: "tjpr_projudi",  nome: "TJPR - Projudi",     sub: "Servidor Projudi Login",       grupo: "PR",        lote: 1, url: "https://projudi.tjpr.jus.br/projudi/" },
    { id: "trt9_1g",       nome: "TRT9 - PJe 1º Grau", sub: "Servidor PJe PR (Varas)",      grupo: "PR",        lote: 1, url: "https://pje.trt9.jus.br/pje/pje-presente.html" },
    { id: "trt9_2g",       nome: "TRT9 - PJe 2º Grau", sub: "Servidor PJe PR (Tribunal)",   grupo: "PR",        lote: 1, url: "https://pje.trt9.jus.br/pje2g/pje-presente.html" },
    { id: "trf4_pr",       nome: "TRF4 - Federal PR",  sub: "Justiça Federal da 4ª Região", grupo: "PR",        lote: 1, url: "https://eproc.trf4.jus.br/eproc2trf4/" },

    // ==========================================
    // SÃO PAULO - SP
    // ==========================================
    { id: "tjsp_saj",      nome: "TJSP - e-SAJ",       sub: "Servidor de Login eSAJ",       grupo: "SP",        lote: 1, url: "https://esaj.tjsp.jus.br/sajcas/login" }
];

export default tribunais;
