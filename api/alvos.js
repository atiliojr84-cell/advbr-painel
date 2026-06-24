const tribunais = [
  // Tribunais Superiores
  { id: "stf", nome: "STF - Eletrônico", url: "https://portal.stf.jus.br/", grupo: "superiores", lote: 1 },
  { id: "stj", nome: "STJ - Processos", url: "https://www.stj.jus.br/sites/portalp/Inicio", grupo: "superiores", lote: 1 },
  { id: "tst", nome: "TST - Processos", url: "https://www.tst.jus.br/", grupo: "superiores", lote: 1 },
  { id: "stm", nome: "STM - Processos", url: "https://www.stm.jus.br/", grupo: "superiores", lote: 1 },
  { id: "cnj", nome: "CNJ - PJe", url: "https://www.cnj.jus.br/pjecnj/", grupo: "superiores", lote: 1 },

  // Sistemas Nacionais
  { id: "pje_cnj", nome: "PJe - Nacional", url: "https://pje.pje.jus.br/login.seam", grupo: "nacionais", lote: 2 },
  { id: "domicilio_cnj", nome: "Domicílio Judicial", url: "https://domicilio-eletronico.pje.jus.br/", grupo: "nacionais", lote: 2 },
  // ... outros sistemas nacionais

  // Tribunais por Estado - Paraná (PR)
  { id: "tjpr_eproc_1g", nome: "TJPR - eproc 1º Grau", url: "https://eproc1g.tjpr.jus.br/eproc/externo_controlador.php?acao=principal", grupo: "PR", lote: 3 },
  { id: "tjpr_projudi", nome: "TJPR - Projudi", url: "https://projudi.tjpr.jus.br/projudi_web/", grupo: "PR", lote: 3 },
  { id: "trf4_pr", nome: "TRF4 - Federal PR", url: "https://www.trf4.jus.br/trf4/controlador.php?acao=pagina_inicial", grupo: "PR", lote: 3 },
  { id: "trt9_1g", nome: "TRT9 - PJe 1º Grau", url: "https://pje.trt9.jus.br/primeirograu/login.seam", grupo: "PR", lote: 3 },
  { id: "trt9_2g", nome: "TRT9 - PJe 2º Grau", url: "https://pje.trt9.jus.br/segundograu/login.seam", grupo: "PR", lote: 3 },
  // ... outros tribunais do PR

  // Tribunais por Estado - São Paulo (SP)
  { id: "tjsp_saj", nome: "TJSP - e-SAJ", url: "https://esaj.tjsp.jus.br/sajcas/login?service=https%3A%2F%2Fesaj.tjsp.jus.br%2Fesaj%2F", grupo: "SP", lote: 4 },
  { id: "trf3_sp", nome: "TRF3 - Federal SP", url: "https://pje1g.trf3.jus.br/pje/login.seam", grupo: "SP", lote: 4 },
  // ... outros tribunais de SP

  // Tribunais por Estado - Rio de Janeiro (RJ)
  { id: "tjrj_pje", nome: "TJRJ - PJe", url: "https://www.tjrj.jus.br/web/guest/pje", grupo: "RJ", lote: 5 },
  // ... e assim por diante para todos os estados e tribunais que você quiser.
];

export default tribunais;
