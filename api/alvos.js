const tribunais = [
  // Lote 1
  { id: "pje_cnj", url: "https://pje.pje.jus.br/pje/login.seam", nome: "PJe - Nacional", grupo: "nacionais", lote: 1 },
  { id: "domicilio_cnj", url: "https://domicilio.pje.jus.br/", nome: "Domicílio Judicial", grupo: "nacionais", lote: 1 },
  { id: "pdpj_cnj", url: "https://www.cnj.jus.br/sistemas/pdpj/", nome: "PDPJ - CNJ", grupo: "nacionais", lote: 1 },

  // Lote 2
  { id: "stj", url: "https://www.stj.jus.br/", nome: "STJ - Processos", grupo: "superiores", lote: 2 },
  { id: "stf", url: "https://portal.stf.jus.br/", nome: "STF - Eletrônico", grupo: "superiores", lote: 2 },
  { id: "tse", url: "https://www.tse.jus.br/", nome: "TSE - Eletrônico", grupo: "superiores", lote: 2 },

  // Lote 3
  { id: "tst", url: "https://www.tst.jus.br/", nome: "TST - Eletrônico", grupo: "superiores", lote: 3 },
  { id: "stm", url: "https://www.stm.jus.br/", nome: "STM - Eletrônico", grupo: "superiores", lote: 3 },
  { id: "tjpr_eproc_1g", url: "https://projudi.tjpr.jus.br/projudi_1g/", nome: "TJPR - eproc 1º Grau", grupo: "PR", lote: 3 },

  // Lote 4
  { id: "tjpr_eproc_2g", url: "https://projudi.tjpr.jus.br/projudi_2g/", nome: "TJPR - eproc 2º Grau", grupo: "PR", lote: 4 },
  { id: "tjpr_projudi", url: "https://projudi.tjpr.jus.br/projudi_1g/", nome: "TJPR - Projudi", grupo: "PR", lote: 4 },
  { id: "trt9_1g", url: "https://pje.trt9.jus.br/primeirograu/login.seam", nome: "TRT9 - PJe 1º Grau", grupo: "PR", lote: 4 },

  // Lote 5
  { id: "trt9_2g", url: "https://pje.trt9.jus.br/segundograu/login.seam", nome: "TRT9 - PJe 2º Grau", grupo: "PR", lote: 5 },
  { id: "trf4_pr", url: "https://www.trf4.jus.br/trf4/controlador.php?acao=pagina_inicial", nome: "TRF4 - Federal PR", grupo: "PR", lote: 5 },
  { id: "tjsp_saj", url: "https://esaj.tjsp.jus.br/sajcas/login?service=https%3A%2F%2Fesaj.tjsp.jus.br%2Fesaj%2F", nome: "TJSP - e-SAJ", grupo: "SP", lote: 5 }
];

export default tribunais;
