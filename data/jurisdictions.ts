export const jurisdictions = {
  federais: [
    { name: "STF", url: "https://portal.stf.jus.br/", alerta: null },
    { name: "STJ", url: "https://www.stj.jus.br/", alerta: null },
    { name: "TST", url: "https://www.tst.jus.br/", alerta: null },
    { name: "TSE", url: "https://www.tse.jus.br/", alerta: null },
    { name: "CNJ", url: "https://www.cnj.jus.br/", alerta: null },
    { name: "PJe Nacional", url: "https://www.pje.jus.br", alerta: null },
    { name: "TRF1", url: "https://www.trf1.jus.br/", alerta: null },
    { name: "TRF2", url: "https://www.trf2.jus.br/", alerta: null },
    { name: "TRF3", url: "https://pje1g.trf3.jus.br/pje/login.seam", alerta: null },
    { name: "TRF4", url: "https://www.trf4.jus.br/", alerta: null },
    { name: "TRF5", url: "https://www.trf5.jus.br/", alerta: null }
  ],
  regioes: {
    Norte: {
      Acre: [{ name: "TJAC", url: "https://www.tjac.jus.br/", alerta: null }, { name: "PJe TJAC", url: "https://pje.tjac.jus.br/", alerta: null }, { name: "TRT14", url: "https://pje.trt14.jus.br/", alerta: null }, { name: "TRE-AC", url: "https://www.tre-ac.jus.br/", alerta: null }],
      Amapá: [{ name: "TJAP", url: "https://www.tjap.jus.br/", alerta: null }, { name: "PJe TJAP", url: "https://pje.tjap.jus.br/1gconsulta/", alerta: null }, { name: "TRT8", url: "https://pje.trt8.jus.br/", alerta: null }, { name: "TRE-AP", url: "https://www.tre-ap.jus.br/", alerta: null }],
      Amazonas: [{ name: "TJAM", url: "https://www.tjam.jus.br/", alerta: null }, { name: "e-SAJ TJAM", url: "https://consultasaj.tjam.jus.br/sajcas/login?service=https%3A%2F%2Fconsultasaj.tjam.jus.br%2Fpetpg%2Fj_spring_cas_security_check", alerta: null }, { name: "TRT11", url: "https://pje.trt11.jus.br/primeirograu/login.seam", alerta: null }, { name: "TRE-AM", url: "https://www.tre-am.jus.br/", alerta: null }],
      Pará: [{ name: "TJPA", url: "https://www.tjpa.jus.br/", alerta: null }, { name: "PJe TJPA", url: "https://pje.tjpa.jus.br/", alerta: null }, { name: "TRT8", url: "https://pje.trt8.jus.br/", alerta: null }, { name: "TRE-PA", url: "https://www.tre-pa.jus.br/", alerta: null }],
      Rondônia: [{ name: "TJRO", url: "https://www.tjro.jus.br/", alerta: null }, { name: "PJe TJRO", url: "https://pje.tjro.jus.br/", alerta: null }, { name: "TRT14", url: "https://pje.trt14.jus.br/", alerta: null }, { name: "TRE-RO", url: "https://www.tre-ro.jus.br/", alerta: null }],
      Roraima: [{ name: "TJRR", url: "https://www.tjrr.jus.br/", alerta: null }, { name: "PJe TJRR", url: "https://pje.tjrr.jus.br/", alerta: null }, { name: "TRT11", url: "https://pje.trt11.jus.br/", alerta: null }, { name: "TRE-RR", url: "https://www.tre-rr.jus.br/", alerta: null }],
      Tocantins: [{ name: "TJTO", url: "https://www.tjto.jus.br/", alerta: null }, { name: "Eproc TJTO", url: "https://eproc1.tjto.jus.br/eprocV2_prod_1grau/", alerta: null }, { name: "TRT10", url: "https://pje.trt10.jus.br/", alerta: null }, { name: "TRE-TO", url: "https://www.tre-to.jus.br/", alerta: null }]
    },
    Nordeste: {
      Alagoas: [{ name: "TJAL", url: "https://www.tjal.jus.br/", alerta: null }, { name: "e-SAJ AL", url: "https://www2.tjal.jus.br/sajcas/login", alerta: null }, { name: "TRT19", url: "https://pje.trt19.jus.br/", alerta: null }, { name: "TRE-AL", url: "https://www.tre-al.jus.br/", alerta: null }],
      Bahia: [{ name: "TJBA", url: "https://www.tjba.jus.br/", alerta: null }, { name: "PJe TJBA", url: "https://pje.tjba.jus.br/pje/login.seam", alerta: null }, { name: "TRT5", url: "https://pje.trt5.jus.br/", alerta: null }, { name: "TRE-BA", url: "https://www.tre-ba.jus.br/", alerta: null }],
      Ceará: [{ name: "TJCE", url: "https://www.tjce.jus.br/", alerta: null }, { name: "e-SAJ CE", url: "https://esaj.tjce.jus.br/", alerta: null }, { name: "TRT7", url: "https://pje.trt7.jus.br/", alerta: null }, { name: "TRE-CE", url: "https://www.tre-ce.jus.br/", alerta: null }],
      Maranhão: [{ name: "TJMA", url: "https://www.tjma.jus.br/", alerta: null }, { name: "PJe TJMA", url: "https://pje.tjma.jus.br/pje/login.seam", alerta: null }, { name: "TRT16", url: "https://pje.trt16.jus.br/", alerta: null }, { name: "TRE-MA", url: "https://www.tre-ma.jus.br/", alerta: null }],
      Paraíba: [{ name: "TJPB", url: "https://www.tjpb.jus.br/", alerta: null }, { name: "PJe TJPB", url: "https://pje.tjpb.jus.br/pje/login.seam", alerta: null }, { name: "TRT13", url: "https://pje.trt13.jus.br/primeirograu/login.seam", alerta: null }, { name: "TRE-PB", url: "https://www.tre-pb.jus.br/", alerta: null }],
      Pernambuco: [{ name: "TJPE", url: "https://www.tjpe.jus.br/", alerta: null }, { name: "PJe TJPE", url: "https://pje.tjpe.jus.br/", alerta: null }, { name: "TRT6", url: "https://pje.trt6.jus.br/", alerta: null }, { name: "TRE-PE", url: "https://www.tre-pe.jus.br/", alerta: null }],
      Piauí: [{ name: "TJPI", url: "https://www.tjpi.jus.br/", alerta: null }, { name: "PJe TJPI", url: "https://pje.tjpi.jus.br/1g/login.seam", alerta: null }, { name: "TRT22", url: "https://pje.trt22.jus.br/", alerta: null }, { name: "TRE-PI", url: "https://www.tre-pi.jus.br/", alerta: null }],
      "Rio Grande do Norte": [{ name: "TJRN", url: "https://www.tjrn.jus.br/", alerta: null }, { name: "PJe TJRN", url: "https://pje1g.tjrn.jus.br/pje/login.seam", alerta: null }, { name: "TRT21", url: "https://pje.trt21.jus.br/", alerta: null }, { name: "TRE-RN", url: "https://www.tre-rn.jus.br/", alerta: null }],
      Sergipe: [{ name: "TJSE", url: "https://www.tjse.jus.br/", alerta: null }, { name: "Portal TJSE", url: "https://www.tjse.jus.br/portal/", alerta: null }, { name: "TRT20", url: "https://pje.trt20.jus.br/", alerta: null }, { name: "TRE-SE", url: "https://www.tre-se.jus.br/", alerta: null }]
    },
    CentroOeste: {
      "Distrito Federal": [{ name: "TJDFT", url: "https://www.tjdft.jus.br/", alerta: null }, { name: "PJe TJDFT", url: "https://pje.tjdft.jus.br/pje/login.seam", alerta: null }, { name: "TRT10", url: "https://pje.trt10.jus.br/", alerta: null }, { name: "TRE-DF", url: "https://www.tre-df.jus.br/", alerta: null }],
      Goiás: [{ name: "Projudi TJGO", url: "https://projudi.tjgo.jus.br/", alerta: null }, { name: "TRT18", url: "https://pje.trt18.jus.br/", alerta: null }, { name: "TRE-GO", url: "https://www.tre-go.jus.br/", alerta: null }],
      "Mato Grosso": [{ name: "TJMT", url: "https://www.tjmt.jus.br/", alerta: null }, { name: "TRT23", url: "https://pje.trt23.jus.br/", alerta: null }, { name: "TRE-MT", url: "https://www.tre-mt.jus.br/", alerta: null }],
      "Mato Grosso do Sul": [{ name: "TJMS", url: "https://www.tjms.jus.br/", alerta: null }, { name: "e-SAJ MS", url: "https://esaj.tjms.jus.br/", alerta: null }, { name: "TRT24", url: "https://pje.trt24.jus.br/", alerta: null }, { name: "TRE-MS", url: "https://www.tre-ms.jus.br/", alerta: null }]
    },
    Sudeste: {
      "São Paulo": [{ name: "TJSP", url: "https://www.tjsp.jus.br/", alerta: null }, { name: "e-SAJ SP", url: "https://esaj.tjsp.jus.br/", alerta: null }, { name: "TRT2", url: "https://pje.trt2.jus.br/primeirograu/login.seam", alerta: null }, { name: "TRE-SP", url: "https://www.tre-sp.jus.br/", alerta: null }],
      "Rio de Janeiro": [{ name: "TJRJ", url: "https://www.tjrj.jus.br/", alerta: null }, { name: "e-JUD RJ", url: "https://www.tjrj.jus.br/", alerta: null }, { name: "TRT1", url: "https://pje.trt1.jus.br/", alerta: null }, { name: "TRE-RJ", url: "https://www.tre-rj.jus.br/", alerta: null }],
      "Minas Gerais": [{ name: "TJMG", url: "https://www.tjmg.jus.br/", alerta: null }, { name: "PJe TJMG", url: "https://pje.tjmg.jus.br/", alerta: null }, { name: "TRT3", url: "https://pje.trt3.jus.br/", alerta: null }, { name: "TRE-MG", url: "https://www.tre-mg.jus.br/", alerta: null }],
      "Espírito Santo": [{ name: "TJES", url: "https://www.tjes.jus.br/", alerta: null }, { name: "PJe TJES", url: "https://pje.tjes.jus.br/pje/login.seam", alerta: null }, { name: "TRT17", url: "https://pje.trt17.jus.br/", alerta: null }, { name: "TRE-ES", url: "https://www.tre-es.jus.br/", alerta: null }]
    },
    Sul: {
      Paraná: [{ name: "TJPR", url: "https://www.tjpr.jus.br/", alerta: null }, { name: "E-proc TJPR", url: "https://eproc1g.tjpr.jus.br/", alerta: null }, { name: "TRT9", url: "https://pje.trt9.jus.br/", alerta: null }, { name: "TRE-PR", url: "https://www.tre-pr.jus.br/", alerta: null }],
      "Santa Catarina": [{ name: "TJSC", url: "https://www.tjsc.jus.br/", alerta: null }, { name: "E-proc TJSC", url: "https://eproc1g.tjsc.jus.br/", alerta: null }, { name: "TRT12", url: "https://pje.trt12.jus.br/", alerta: null }, { name: "TRE-SC", url: "https://www.tre-sc.jus.br/", alerta: null }],
      "Rio Grande do Sul": [{ name: "TJRS", url: "https://www.tjrs.jus.br/", alerta: null }, { name: "E-proc TJRS", url: "https://eproc1g.tjrs.jus.br/eproc/", alerta: null }, { name: "TRT4", url: "https://pje.trt4.jus.br/", alerta: null }, { name: "TRE-RS", url: "https://www.tre-rs.jus.br/", alerta: null }]
    }
  }
};
