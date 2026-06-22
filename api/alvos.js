// api/alvos.js - Lista oficial de tribunais monitorados pelo ADVBR.info
const tribunais = [
    // Nacionais
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://pje.jus.br/pje/", grupo: "nacionais" },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/", grupo: "nacionais" },
    { id: "stf", nome: "STF - Eletrônico", url: "https://portal.stf.jus.br/", grupo: "nacionais" },
    
    // Paraná
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/", grupo: "PR" },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/", grupo: "PR" },
    { id: "trt9_pje", nome: "TRT9 (PR) - PJe", url: "https://pje.trt9.jus.br/pjek-ecm/", grupo: "PR" },
    
    // São Paulo
    { id: "tjsp_esaj", nome: "TJSP - e-SAJ", url: "https://esaj.tjsp.jus.br/", grupo: "SP" },
    { id: "trt2_pje", nome: "TRT2 (SP) - PJe", url: "https://pje.trt2.jus.br/", grupo: "SP" },
    { id: "trf3_pje", nome: "TRF3 (SP/MS) - PJe", url: "https://pje1g.trf3.jus.br/", grupo: "SP" }
];

module.exports = tribunais;
