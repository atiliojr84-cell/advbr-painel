// data/jurisdictions.ts

export const jurisdictions = {
  federais: [
    { name: "STF - Supremo Tribunal Federal", url: "https://www.stf.jus.br" },
    { name: "STJ - Superior Tribunal de Justiça", url: "https://www.stj.jus.br" },
    { name: "TST - Tribunal Superior do Trabalho", url: "https://www.tst.jus.br" },
    { name: "PJe Nacional", url: "https://www.pje.jus.br" },
  ],
  regioes: {
    sul: {
      parana: [
        { name: "TJPR (E-proc)", url: "https://eproc1g.tjpr.jus.br/eproc/" },
        { name: "TRT9 (PJe)", url: "https://pje.trt9.jus.br/primeirograu/login.seam" },
        { name: "TRF4 (E-proc)", url: "https://eproc.trf4.jus.br/eproc2trf4/externo_controlador.php" }
      ],
      santaCatarina: [],
      rioGrandeDoSul: []
    },
    sudeste: {
      saoPaulo: [
        { name: "TJSP (e-SAJ)", url: "https://esaj.tjsp.jus.br" },
        { name: "TRT2 (PJe)", url: "https://pje.trtsp.jus.br/primeirograu/login.seam" },
        { name: "TRF3 (PJe)", url: "https://pje1g.trf3.jus.br/pje/login.seam" }
      ],
      rioDeJaneiro: [],
      minasGerais: [],
      espiritoSanto: []
    }
  }
};
