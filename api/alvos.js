// api/alvos.js - Lista oficial por ESTADO para os botões do ADVBR.info
const tribunais = [
    // Nacionais (Ficam no topo ou carrossel)
    { id: "pje_cnj", nome: "PJe Nacional (CNJ)", url: "https://pje.jus.br/pje/", grupo: "nacionais" },
    { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/", grupo: "nacionais" },
    { id: "stf", nome: "STF - Eletrônico", url: "https://portal.stf.jus.br/", grupo: "nacionais" },
    
    // Acre
    { id: "tjac_pje", nome: "TJAC - PJe", url: "https://pje.tjac.jus.br/", grupo: "AC" },
    
    // Alagoas
    { id: "tjal_esaj", nome: "TJAL - e-SAJ", url: "https://esaj.tjal.jus.br/", grupo: "AL" },
    { id: "trt19_pje", nome: "TRT19 (AL) - PJe", url: "https://pje.trt19.jus.br/", grupo: "AL" },
    
    // Amapá
    { id: "tjap_pje", nome: "TJAP - Tucujuris", url: "https://pje.tjap.jus.br/", grupo: "AP" },
    
    // Amazonas
    { id: "tjam_esaj", nome: "TJAM - e-SAJ", url: "https://esaj.tjam.jus.br/", grupo: "AM" },
    
    // Bahia
    { id: "tjba_pje", nome: "TJBA - PJe", url: "https://pje.tjba.jus.br/", grupo: "BA" },
    { id: "trt5_pje", nome: "TRT5 (BA) - PJe", url: "https://pje.trt5.jus.br/", grupo: "BA" },
    
    // Ceará
    { id: "tjce_pje", nome: "TJCE - PJe", url: "https://pje.tjce.jus.br/", grupo: "CE" },
    { id: "trt7_pje", nome: "TRT7 (CE) - PJe", url: "https://pje.trt7.jus.br/", grupo: "CE" },
    
    // Distrito Federal
    { id: "tjdft_pje", nome: "TJDFT - PJe", url: "https://pje.tjdft.jus.br/", grupo: "DF" },
    { id: "trt10_pje", nome: "TRT10 (DF) - PJe", url: "https://pje.trt10.jus.br/", grupo: "DF" },
    
    // Espírito Santo
    { id: "tjes_pje", nome: "TJES - PJe", url: "https://pje.tjes.jus.br/", grupo: "ES" },
    { id: "trt17_pje", nome: "TRT17 (ES) - PJe", url: "https://pje.trt17.jus.br/", grupo: "ES" },
    
    // Goiás
    { id: "tjgo_pje", nome: "TJGO - PJe", url: "https://pje.tjgo.jus.br/", grupo: "GO" },
    { id: "trt18_pje", nome: "TRT18 (GO) - PJe", url: "https://pje.trt18.jus.br/", grupo: "GO" },
    
    // Maranhão
    { id: "tjma_pje", nome: "TJMA - PJe", url: "https://pje.tjma.jus.br/", grupo: "MA" },
    { id: "trt16_pje", nome: "TRT16 (MA) - PJe", url: "https://pje.trt16.jus.br/", grupo: "MA" },
    
    // Mato Grosso
    { id: "tjmt_pje", nome: "TJMT - PJe", url: "https://pje.tjmt.jus.br/", grupo: "MT" },
    { id: "trt23_pje", nome: "TRT23 (MT) - PJe", url: "https://pje.trt23.jus.br/", grupo: "MT" },
    
    // Mato Grosso do Sul
    { id: "tjms_esaj", nome: "TJMS - e-SAJ", url: "https://esaj.tjms.jus.br/", grupo: "MS" },
    { id: "trt24_pje", nome: "TRT24 (MS) - PJe", url: "https://pje.trt24.jus.br/", grupo: "MS" },
    
    // Minas Gerais
    { id: "tjmg_pje", nome: "TJMG - PJe", url: "https://pje.tjmg.jus.br/", grupo: "MG" },
    { id: "trt3_pje", nome: "TRT3 (MG) - PJe", url: "https://pje.trt3.jus.br/", grupo: "MG" },
    
    // Pará
    { id: "tjpa_pje", nome: "TJPA - PJe", url: "https://pje.tjpa.jus.br/", grupo: "PA" },
    { id: "trt8_pje", nome: "TRT8 (PA/AP) - PJe", url: "https://pje.trt8.jus.br/", grupo: "PA" },
    
    // Paraíba
    { id: "tjpb_pje", nome: "TJPB - PJe", url: "https://pje.tjpb.jus.br/", grupo: "PB" },
    { id: "trt13_pje", nome: "TRT13 (PB) - PJe", url: "https://pje.trt13.jus.br/", grupo: "PB" },
    
    // Paraná
    { id: "tjpr_eproc", nome: "TJPR - eproc", url: "https://eproc.tjpr.jus.br/", grupo: "PR" },
    { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi/", grupo: "PR" },
    { id: "trt9_pje", nome: "TRT9 (PR) - PJe", url: "https://pje.trt9.jus.br/pjek-ecm/", grupo: "PR" },
    
    // Pernambuco
    { id: "tjpe_pje", nome: "TJPE - PJe", url: "https://pje.tjpe.jus.br/", grupo: "PE" },
    { id: "trt6_pje", nome: "TRT6 (PE) - PJe", url: "https://pje.trt6.jus.br/", grupo: "PE" },
    
    // Piauí
    { id: "tjpi_pje", nome: "TJPI - PJe", url: "https://pje.tjpi.jus.br/", grupo: "PI" },
    { id: "trt22_pje", nome: "TRT22 (PI) - PJe", url: "https://pje.trt22.jus.br/", grupo: "PI" },
    
    // Rio de Janeiro
    { id: "tjrj_pje", nome: "TJRJ - Portal", url: "https://pje.tjrj.jus.br/", grupo: "RJ" },
    { id: "trt1_pje", nome: "TRT1 (RJ) - PJe", url: "https://pje.trt1.jus.br/", grupo: "RJ" },
    
    // Rio Grande do Norte
    { id: "tjrn_pje", nome: "TJRN - PJe", url: "https://pje.tjrn.jus.br/", grupo: "RN" },
    { id: "trt21_pje", nome: "TRT21 (RN) - PJe", url: "https://pje.trt21.jus.br/", grupo: "RN" },
    
    // Rio Grande do Sul
    { id: "tjrs_eproc", nome: "TJRS - eproc", url: "https://eproc.tjrs.jus.br/", grupo: "RS" },
    { id: "trt4_pje", nome: "TRT4 (RS) - PJe", url: "https://pje.trt4.jus.br/", grupo: "RS" },
    
    // Rondônia
    { id: "tjro_pje", nome: "TJRO - PJe", url: "https://pje.tjro.jus.br/", grupo: "RO" },
    { id: "trt14_pje", nome: "TRT14 (RO/AC) - PJe", url: "https://pje.trt14.jus.br/", grupo: "RO" },
    
    // Roraima
    { id: "tjrr_pje", nome: "TJRR - Portal", url: "https://www.tjrr.jus.br/", grupo: "RR" },
    
    // Santa Catarina
    { id: "tjsc_eproc", nome: "TJSC - eproc", url: "https://eproc2g.tjsc.jus.br/", grupo: "SC" },
    { id: "trt12_pje", nome: "TRT12 (SC) - PJe", url: "https://pje.trt12.jus.br/", grupo: "SC" },
    
    // São Paulo
    { id: "tjsp_esaj", nome: "TJSP - e-SAJ", url: "https://esaj.tjsp.jus.br/", grupo: "SP" },
    { id: "trt2_pje", nome: "TRT2 (SP) - PJe", url: "https://pje.trt2.jus.br/", grupo: "SP" },
    { id: "trf3_pje", nome: "TRF3 (SP/MS) - PJe", url: "https://pje1g.trf3.jus.br/", grupo: "SP" },
    
    // Sergipe
    { id: "tjse_pje", nome: "TJSE - Portal", url: "https://www.tjse.jus.br/", grupo: "SE" },
    { id: "trt20_pje", nome: "TRT20 (SE) - PJe", url: "https://pje.trt20.jus.br/", grupo: "SE" },
    
    // Tocantins
    { id: "tjto_eproc", nome: "TJTO - eproc", url: "https://eproc.tjto.jus.br/", grupo: "TO" }
];

module.exports = tribunais;
