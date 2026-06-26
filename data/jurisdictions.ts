export const jurisdictions = {
  federais: [
    { name: "STF", url: "https://www.stf.jus.br", alerta: null },
    { name: "STJ", url: "https://www.stj.jus.br", alerta: null },
    { name: "TST", url: "https://www.tst.jus.br", alerta: null },
    { name: "PJe Nacional", url: "https://www.pje.jus.br", alerta: null },
  ],
  regioes: {
    Norte: {
      Acre: [], Amapá: [], Amazonas: [], Pará: [], Rondônia: [], Roraima: [], Tocantins: []
    },
    Nordeste: {
      Alagoas: [], Bahia: [], Ceará: [], Maranhão: [], Paraíba: [], Pernambuco: [], Piauí: [], "Rio Grande do Norte": [], Sergipe: []
    },
    CentroOeste: {
      "Distrito Federal": [], Goiás: [], "Mato Grosso": [], "Mato Grosso do Sul": []
    },
    Sudeste: {
      "São Paulo": [
        { name: "TJSP (e-SAJ)", url: "https://esaj.tjsp.jus.br", alerta: null },
        { name: "TRT2 (PJe)", url: "https://pje.trtsp.jus.br/primeirograu/login.seam", alerta: null },
        { name: "TRF3 (PJe)", url: "https://pje1g.trf3.jus.br/pje/login.seam", alerta: null }
      ],
      "Rio de Janeiro": [
        { name: "TJRJ (e-JUD)", url: "https://www.tjrj.jus.br", alerta: null },
        { name: "TRT1 (PJe)", url: "https://pje.trt1.jus.br/", alerta: null }
      ],
      "Minas Gerais": [
        { name: "TJMG (PJe)", url: "https://pje.tjmg.jus.br/", alerta: null },
        { name: "TRT3 (PJe)", url: "https://pje.trt3.jus.br/", alerta: null }
      ],
      "Espírito Santo": [
        { name: "TJES (PJe)", url: "https://pje.tjes.jus.br/", alerta: null },
        { name: "TRT17 (PJe)", url: "https://pje.trt17.jus.br/", alerta: null }
      ]
    },
    Sul: {
      Paraná: [
        { name: "TJPR (E-proc)", url: "https://eproc1g.tjpr.jus.br/eproc/", alerta: null },
        { name: "TRT9 (PJe)", url: "https://pje.trt9.jus.br/primeirograu/login.seam", alerta: null },
        { name: "TRF4 (E-proc)", url: "https://eproc.trf4.jus.br/eproc2trf4/externo_controlador.php", alerta: null }
      ],
      "Santa Catarina": [
        { name: "TJSC (E-proc)", url: "https://esaj.tjsc.jus.br", alerta: null },
        { name: "TRT12 (PJe)", url: "https://pje.trt12.jus.br/", alerta: null }
      ],
      "Rio Grande do Sul": [
        { name: "TJRS (E-proc)", url: "https://www.tjrs.jus.br", alerta: null },
        { name: "TRT4 (PJe)", url: "https://pje.trt4.jus.br/", alerta: null }
      ]
    }
  }
};
