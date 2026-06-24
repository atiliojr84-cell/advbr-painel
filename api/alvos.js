// api/alvos.js
const tribunais = [
  // ────────────── GRUPO: SISTEMAS NACIONAIS ──────────────
  { id: "pje_cnj", url: "https://pje.cjf.jus.br/pje-web/login.seam", nome: "PJe - Nacional", grupo: "nacionais", lote: 1 },
  { id: "domicilio_cnj", url: "https://domicilio-judicial.cnj.jus.br", nome: "Domicílio Judicial CNJ", grupo: "nacionais", lote: 1 },
  { id: "pdpj_cnj", url: "https://www.cnj.jus.br/pdpj", nome: "PDPJ CNJ", grupo: "nacionais", lote: 1 },

  // ────────────── GRUPO: SUPERIORES ──────────────
  { id: "stj", url: "https://processo.stj.jus.br", nome: "STJ - Processos", grupo: "superiores", lote: 2 },
  { id: "stf", url: "https://portal.stf.jus.br", nome: "STF - Processo Eletrônico", grupo: "superiores", lote: 2 },
  { id: "tse", url: "https://www.tse.jus.br", nome: "TSE - Processos", grupo: "superiores", lote: 2 },
  { id: "tst", url: "https://www.tst.jus.br", nome: "TST - Processo Eletrônico", grupo: "superiores", lote: 3 },
  { id: "stm", url: "https://www.stm.jus.br", nome: "STM - Processos", grupo: "superiores", lote: 3 },

  // ────────────── PARANÁ (PR) ──────────────
  { id: "tjpr_eproc_1g", url: "https://projudi.tjpr.jus.br/projudi_1g/", nome: "TJPR - eproc 1º Grau", grupo: "PR", lote: 4 },
  { id: "tjpr_eproc_2g", url: "https://projudi.tjpr.jus.br/projudi_2g/", nome: "TJPR - eproc 2º Grau", grupo: "PR", lote: 4 },
  { id: "tjpr_projudi", url: "https://projudi.tjpr.jus.br/projudi_1g/", nome: "TJPR - Projudi", grupo: "PR", lote: 4 },
  { id: "trt9_1g", url: "https://pje.trt9.jus.br/primeirograu/login.seam", nome: "TRT9 - PJe 1º Grau", grupo: "PR", lote: 5 },
  { id: "trt9_2g", url: "https://pje.trt9.jus.br/segundograu/login.seam", nome: "TRT9 - PJe 2º Grau", grupo: "PR", lote: 5 },
  { id: "trf4_pr", url: "https://www.trf4.jus.br/trf4/controlador.php?acao=pagina_inicial", nome: "TRF4 - Seção Judiciária PR", grupo: "PR", lote: 5 },

  // ────────────── SÃO PAULO (SP) ──────────────
  { id: "tjsp_saj", url: "https://esaj.tjsp.jus.br/sajcas/login", nome: "TJSP - e-SAJ", grupo: "SP", lote: 6 },
  { id: "trt2_pje", url: "https://pje.trt2.jus.br/login.seam", nome: "TRT2 - PJe", grupo: "SP", lote: 6 },
  { id: "trf3_sp", url: "https://pje.trf3.jus.br/pje-web/login.seam", nome: "TRF3 - Seção Judiciária SP", grupo: "SP", lote: 6 },

  // ────────────── RIO DE JANEIRO (RJ) ──────────────
  { id: "tjrj_pje", url: "https://pje.tjrj.jus.br", nome: "TJRJ - PJe", grupo: "RJ", lote: 7 },
  { id: "trt1_pje", url: "https://pje.trt1.jus.br/login.seam", nome: "TRT1 - PJe", grupo: "RJ", lote: 7 },
  { id: "trf2_rj", url: "https://pje.trf2.jus.br/pje-web/login.seam", nome: "TRF2 - Seção Judiciária RJ", grupo: "RJ", lote: 7 },

  // ────────────── MINAS GERAIS (MG) ──────────────
  { id: "tjmg_pje", url: "https://pje.tjmg.jus.br", nome: "TJMG - PJe", grupo: "MG", lote: 8 },
  { id: "trt3_pje", url: "https://pje.trt3.jus.br/login.seam", nome: "TRT3 - PJe", grupo: "MG", lote: 8 },
  { id: "trf1_mg", url: "https://pje.trf1.jus.br/pje-web/login.seam", nome: "TRF1 - Seção Judiciária MG", grupo: "MG", lote: 8 },

  // ────────────── RIO GRANDE DO SUL (RS) ──────────────
  { id: "tjrs_eproc", url: "https://www.tjrs.jus.br/site/processos/eproc/", nome: "TJRS - eproc", grupo: "RS", lote: 9 },
  { id: "trt4_pje", url: "https://pje.trt4.jus.br/login.seam", nome: "TRT4 - PJe", grupo: "RS", lote: 9 },
  { id: "trf4_rs", url: "https://pje.trf4.jus.br/pje-web/login.seam", nome: "TRF4 - Seção Judiciária RS", grupo: "RS", lote: 9 },

  // ────────────── SANTA CATARINA (SC) ──────────────
  { id: "tjsc_eproc", url: "https://eproc2g.tjsc.jus.br/eproc2g/", nome: "TJSC - eproc", grupo: "SC", lote: 9 },
  { id: "trt12_pje", url: "https://pje.trt12.jus.br/login.seam", nome: "TRT12 - PJe", grupo: "SC", lote: 9 },
  { id: "trf4_sc", url: "https://pje.trf4.jus.br/pje-web/login.seam", nome: "TRF4 - Seção Judiciária SC", grupo: "SC", lote: 9 },

  // ────────────── BAHIA (BA) ──────────────
  { id: "tjba_pje", url: "https://pje.tjba.jus.br", nome: "TJBA - PJe", grupo: "BA", lote: 10 },
  { id: "trt5_pje", url: "https://pje.trt5.jus.br/login.seam", nome: "TRT5 - PJe", grupo: "BA", lote: 10 },
  { id: "trf1_ba", url: "https://pje.trf1.jus.br/pje-web/login.seam", nome: "TRF1 - Seção Judiciária BA", grupo: "BA", lote: 10 },

  // ────────────── PERNAMBUCO (PE) ──────────────
  { id: "tjpe_pje", url: "https://pje.tjpe.jus.br", nome: "TJPE - PJe", grupo: "PE", lote: 10 },
  { id: "trt6_pje", url: "https://pje.trt6.jus.br/login.seam", nome: "TRT6 - PJe", grupo: "PE", lote: 10 },
  { id: "trf5_pe", url: "https://pje.trf5.jus.br/pje-web/login.seam", nome: "TRF5 - Seção Judiciária PE", grupo: "PE", lote: 10 }
];

export default tribunais;
