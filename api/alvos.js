// api/alvos.js - Base de Dados de Tribunais Atualizada (ADVBR.info)
const tribunais = [
    // Nacionais
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://www.pje.jus.br/navegador/", grupo: "nacionais" },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/inicio", grupo: "nacionais" },
    { id: "stf", nome: "STF - Eletrônico", url: "https://portal.stf.jus.br/", grupo: "nacionais" },
    
    // Acre
    { id: "tjac_pje", nome: "TJAC - PJe", url: "https://pje.tjac.jus.br/", grupo: "AC" },
    
    // Alagoas
    { id: "tjal_paj", nome: "TJAL - SAJ", url: "https://esaj.tjal.jus.br/", grupo: "AL" },
    
    // Amapá
    { id: "tjap_tucujuris", nome: "TJAP - Tucujuris", url: "https://tucujuris.tjap.jus.br/", grupo: "AM" },
    
    // Amazonas
    { id: "tjam_pje", nome: "TJAM - PJe", url: "https://pje.tjam.jus.br/", grupo: "AM" },
    
    // Bahia
    { id: "tjba_pje", nome: "TJBA - PJe", url: "https://pje.tjba.jus.br/", grupo: "BA" },
    
    // Ceará
    { id: "tjce_saj", nome: "TJCE - SAJ", url: "https://esaj.tjce.jus.br/", grupo: "CE" },
    
    // Distrito Federal
    { id: "tjdft_pje", nome: "TJDFT - PJe", url: "https://pje.tjdft.jus.br/", grupo: "DF" },
    
    // Espírito Santo
    { id: "tjes_pje", nome: "TJES - PJe", url: "https://pje.tjes.jus.br/", grupo: "ES" },
    
    // Goiás
    { id: "tjgo_pje", nome: "TJGO - PJe", url: "https://pje.tjgo.jus.br/", grupo: "GO" },
    
    // Maranhão
    { id: "tjma_pje", nome: "TJMA - PJe", url: "https://pje.tjma.jus.br/", grupo: "MA" },
    
    // Mato Grosso
    { id: "tjmt_pje", nome: "TJMT - PJe", url: "https://pje.tjmt.jus.br/", grupo: "MT" },
    
    // Mato Grosso do Sul
    { id: "tjms_saj", nome: "TJMS - SAJ", url: "https://esaj.tjms.jus.br/", grupo: "MS" },
    
    // Minas Gerais
    { id: "tjmg_pje", nome: "TJMG - PJe", url: "https://pje.tjmg.jus.br/", grupo: "MG" },
    
    // Pará
    { id: "tjpa_pje", nome: "TJPA - PJe", url: "https://pje.tjpa.jus.br/", grupo: "PA" },
    
    // Paraíba
    { id: "tjpb_pje", nome: "TJPB - PJe", url: "https://pje.tjpb.jus.br/", grupo: "PB" },
    
    // Paraná
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/eproc_2g/", grupo: "PR" },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/", grupo: "PR" },
    { id: "trt9_1g", nome: "TRT9 (PR) - 1º Grau", url: "https://pje.trt9.jus.br/pje/pje-presente.html", grupo: "PR" },
    { id: "trt9_2g", nome: "TRT9 (PR) - 2º Grau", url: "https://pje.trt9.jus.br/pje2g/pje-presente.html", grupo: "PR" },
    
    // Pernambuco
    { id: "tjpe_pje", nome: "TJPE - PJe", url: "https://pje.tjpe.jus.br/", group: "PE" },
    
    // Piauí
    { id: "tjpi_pje", nome: "TJPI - PJe", url: "https://pje.tjpi.jus.br/", grupo: "PI" },
    
    // Rio de Janeiro
    { id: "tjrj_eproc", nome: "TJRJ - eproc", url: "https://eproc.tjrj.jus.br/", grupo: "RJ" },
    
    // Rio Grande do Norte
    { id: "tjrn_pje", nome: "TJRN - PJe", url: "https://pje.tjrn.jus.br/", grupo: "RN" },
    
    // Rio Grande do Sul
    { id: "tjrs_eproc", nome: "TJRS - eproc", url: "https://eproc.tjrs.jus.br/", grupo: "RS" },
    
    // Rondônia
    { id: "tjro_pje", nome: "TJRO - PJe", url: "https://pje.tjro.jus.br/", grupo: "RO" },
    
    // Roraima
    { id: "tjrr_projudi", nome: "TJRR - Projudi", url: "https://projudi.tjrr.jus.br/", grupo: "RR" },
    
    // Santa Catarina
    { id: "tjsc_eproc", nome: "TJSC - eproc", url: "https://eproc2g.tjsc.jus.br/", grupo: "SC" },
    
    // São Paulo
    { id: "tjsp_saj", nome: "TJSP - SAJ", url: "https://esaj.tjsp.jus.br/", grupo: "SP" },
    
    // Sergipe
    { id: "tjse_portal", nome: "TJSE - Processos", url: "https://www.tjse.jus.br/", grupo: "SE" },
    
    // Tocantins
    { id: "tjto_eproc", nome: "TJTO - eproc", url: "https://eproc.tjto.jus.br/", grupo: "TO" }
];

module.exports = tribunais;
