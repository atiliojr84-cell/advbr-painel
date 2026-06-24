// api/alvos.js - Base de Dados COMPLETA ADVBR.info (Brasil Inteiro)
// Lotes 1-10 para distribuição no Vercel Cron (back-end)
// Grupos padronizados para organização no front-end (ex: "SP", "RJ", "Nacionais")

const tribunais = [
  // =====================================================================
  // LOTE 1: NACIONAIS + SUPERIORES (Parte 1)
  // =====================================================================
  { id: "pje_cnj",       nome: "PJe Nacional (CNJ)",       sub: "Servidor de Login CNJ",            grupo: "Nacionais",  lote: 1, url: "https://www.pje.jus.br/navegador/" },
  { id: "domicilio_cnj",  nome: "Domicílio Judicial",        sub: "Domicílio Judicial Eletrônico",    grupo: "Nacionais",  lote: 1, url: "https://domicilio-eletronico.pdpj.jus.br/" },
  { id: "pdpj_cnj",      nome: "PDPJ - Hub CNJ",            sub: "Plataforma Digital Unificada",     grupo: "Nacionais",  lote: 1, url: "https://www.cnj.jus.br/pdpj-br/" },
  { id: "stj",            nome: "STJ - Processos",           sub: "Superior Tribunal de Justiça",    grupo: "Superiores", lote: 1, url: "https://www.stj.jus.br/sites/portalp/inicio" },
  { id: "stf",            nome: "STF - Eletrônico",          sub: "Autenticação PKI Login",           grupo: "Superiores", lote: 1, url: "https://portal.stf.jus.br/" },
  { id: "tse",            nome: "TSE - Portal",              sub: "Tribunal Superior Eleitoral",      grupo: "Superiores", lote: 1, url: "https://www.tse.jus.br/" },
  { id: "tst",            nome: "TST - PJe",                 sub: "Tribunal Superior do Trabalho",    grupo: "Superiores", lote: 1, url: "https://pje.tst.jus.br/portal-pje/" },
  { id: "stm",            nome: "STM - Portal",              sub: "Superior Tribunal Militar",        grupo: "Superiores", lote: 1, url: "https://www.stm.jus.br/" },
  { id: "trf1",           nome: "TRF1 - Federal",            sub: "Justiça Federal 1ª Região",        grupo: "TRF1",       lote: 1, url: "https://pje.trf1.jus.br/eproc/" },
  { id: "trf2",           nome: "TRF2 - Federal",            sub: "Justiça Federal 2ª Região",        grupo: "TRF2",       lote: 1, url: "https://eproc.trf2.jus.br/eproc2/" },
  { id: "trf3",           nome: "TRF3 - Federal",            sub: "Justiça Federal 3ª Região",        grupo: "TRF3",       lote: 1, url: "https://pje.trf3.jus.br/pje/login.seam" },
  { id: "trf4_pr",        nome: "TRF4 - Federal PR",         sub: "Justiça Federal 4ª Região",        grupo: "TRF4",       lote: 1, url: "https://eproc.trf4.jus.br/eproc2trf4/" },
  { id: "trf5",           nome: "TRF5 - Federal",            sub: "Justiça Federal 5ª Região",        grupo: "TRF5",       lote: 1, url: "https://eproc.trf5.jus.br/eproc2/" },

  // =====================================================================
  // LOTE 2: SÃO PAULO (SP) + RIO DE JANEIRO (RJ)
  // =====================================================================
  { id: "tjsp_saj",       nome: "TJSP - e‑SAJ",              sub: "Servidor de Login eSAJ",           grupo: "SP",           lote: 2, url: "https://esaj.tjsp.jus.br/sajcas/login" },
  { id: "tjsp_eproc",     nome: "TJSP - eproc",              sub: "Servidor eproc 1º e 2º Grau",      grupo: "SP",           lote: 2, url: "https://esaj.tjsp.jus.br/proc/consulta" },
  { id: "tjrj_saj",       nome: "TJRJ - e‑SAJ",              sub: "Servidor de Login eSAJ",           grupo: "RJ",           lote: 2, url: "https://esaj.tjrj.jus.br/sajcas/login" },
  { id: "tjrj_eproc",     nome: "TJRJ - eproc",              sub: "Servidor eproc 1º e 2º Grau",      grupo: "RJ",           lote: 2, url: "https://eproc.tjrj.jus.br/eproc/" },
  { id: "trt1",           nome: "TRT1 - PJe (RJ)",           sub: "TRT Rio de Janeiro",               grupo: "RJ",           lote: 2, url: "https://pje.trt1.jus.br/portal-externo/" },
  { id: "trt2_1g",        nome: "TRT2 - PJe 1º Grau (SP)",   sub: "TRT São Paulo",                    grupo: "SP",           lote: 2, url: "https://pje.trt2.jus.br/pje/pje-presente.html" },
  { id: "trt15",          nome: "TRT15 - PJe (Campinas)",    sub: "TRT Campinas/SP",                  grupo: "SP",           lote: 2, url: "https://pje.trt15.jus.br/portal-externo/" },
  { id: "tjmg",           nome: "TJMG - PJe",                sub: "Tribunal de Justiça MG",           grupo: "MG",           lote: 2, url: "https://pje.tjmg.jus.br/pje/login.seam" },
  { id: "tjrs",           nome: "TJRS - eproc",              sub: "Tribunal de Justiça RS",           grupo: "RS",           lote: 2, url: "https://eproc.tjrs.jus.br/eproc/" },
  { id: "tjpr_eproc_1g",  nome: "TJPR - eproc 1º Grau",      sub: "Servidor eproc 1º Grau",           grupo: "PR",           lote: 2, url: "https://eproc.tjpr.jus.br/eproc_1g/" },
  { id: "tjpr_eproc_2g",  nome: "TJPR - eproc 2º Grau",      sub: "Servidor eproc 2º Grau",           grupo: "PR",           lote: 2, url: "https://eproc.tjpr.jus.br/eproc_2g/" },
  { id: "tjpr_projudi",   nome: "TJPR - Projudi",            sub: "Servidor Projudi Login",           grupo: "PR",           lote: 2, url: "https://projudi.tjpr.jus.br/projudi/" },

  // =====================================================================
  // LOTE 3: SUL (SC, RS) + CENTRO-OESTE (DF, GO, MS, MT)
  // =====================================================================
  { id: "tjsc_esaj",      nome: "TJSC - e‑SAJ",              sub: "Tribunal de Justiça SC",           grupo: "SC",           lote: 3, url: "https://esaj.tjsc.jus.br/sajcas/login" },
  { id: "tjsc_eproc",     nome: "TJSC - eproc",              sub: "Tribunal de Justiça SC",           grupo: "SC",           lote: 3, url: "https://eproc.tjsc.jus.br/eproc/" },
  { id: "tjdf",           nome: "TJDFT - PJe",               sub: "Tribunal de Justiça DF",           grupo: "DF",           lote: 3, url: "https://pje.tjdft.jus.br/pje/login.seam" },
  { id: "tjgo",           nome: "TJGO - eproc",              sub: "Tribunal de Justiça GO",           grupo: "GO",           lote: 3, url: "https://eproc.tjgo.jus.br/eproc/" },
  { id: "tjms",           nome: "TJMS - PJe",                sub: "Tribunal de Justiça MS",           grupo: "MS",           lote: 3, url: "https://pje.tjms.jus.br/pje/login.seam" },
  { id: "tjmt",           nome: "TJMT - PJe",                sub: "Tribunal de Justiça MT",           grupo: "MT",           lote: 3, url: "https://pje.tjmt.jus.br/segundograu/ConsultaPublica/listView.seam" },
  { id: "trt4",           nome: "TRT4 - PJe (RS)",           sub: "TRT Rio Grande do Sul",            grupo: "RS",           lote: 3, url: "https://pje.trt4.jus.br/portal-externo/" },
  { id: "trt12",          nome: "TRT12 - PJe (SC)",          sub: "TRT Santa Catarina",               grupo: "SC",           lote: 3, url: "https://pje.trt12.jus.br/portal-externo/" },
  { id: "trt24",          nome: "TRT24 - PJe (MS)",          sub: "TRT Mato Grosso do Sul",           grupo: "MS",           lote: 3, url: "https://pje.trt24.jus.br/portal-externo/" },
  { id: "trt23",          nome: "TRT23 - PJe (MT)",          sub: "TRT Mato Grosso",                  grupo: "MT",           lote: 3, url: "https://pje.trt23.jus.br/portal-externo/" },
  { id: "trt10",          nome: "TRT10 - PJe (DF, TO)",      sub: "TRT Distrito Federal/Tocantins",   grupo: "DF",           lote: 3, url: "https://pje.trt10.jus.br/portal-externo/" },
  { id: "trt18",          nome: "TRT18 - PJe (GO)",          sub: "TRT Goiás",                        grupo: "GO",           lote: 3, url: "https://pje.trt18.jus.br/portal-externo/" },

  // =====================================================================
  // LOTE 4: NORDESTE (BA, CE, PE)
  // =====================================================================
  { id: "tjba",           nome: "TJBA - PJe",                sub: "Tribunal de Justiça BA",           grupo: "BA",           lote: 4, url: "https://pje.tjba.jus.br/pje/login.seam" },
  { id: "tjce",           nome: "TJCE - PJe",                sub: "Tribunal de Justiça CE",           grupo: "CE",           lote: 4, url: "https://pje.tjce.jus.br/pje/login.seam" },
  { id: "tjpe",           nome: "TJPE - PJe",                sub: "Tribunal de Justiça PE",           grupo: "PE",           lote: 4, url: "https://pje.tjpe.jus.br/pje/login.seam" },
  { id: "trt5",           nome: "TRT5 - PJe (BA)",           sub: "TRT Bahia",                        grupo: "BA",           lote: 4, url: "https://pje.trt5.jus.br/portal-externo/" },
  { id: "trt7",           nome: "TRT7 - PJe (CE)",           sub: "TRT Ceará",                        grupo: "CE",           lote: 4, url: "https://pje.trt7.jus.br/portal-externo/" },
  { id: "trt6",           nome: "TRT6 - PJe (PE)",           sub: "TRT Pernambuco",                   grupo: "PE",           lote: 4, url: "https://pje.trt6.jus.br/portal-externo/" },
  { id: "tjrn",           nome: "TJRN - PJe",                sub: "Tribunal de Justiça RN",           grupo: "RN",           lote: 4, url: "https://pje.tjrn.jus.br/pje/login.seam" },
  { id: "tjse",           nome: "TJSE - PJe",                sub: "Tribunal de Justiça SE",           grupo: "SE",           lote: 4, url: "https://pje.tjse.jus.br/pje/login.seam" },
  { id: "tjpi",           nome: "TJPI - PJe",                sub: "Tribunal de Justiça PI",           grupo: "PI",           lote: 4, url: "https://pje.tjpi.jus.br/pje/login.seam" },
  { id: "tjma",           nome: "TJMA - PJe",                sub: "Tribunal de Justiça MA",           grupo: "MA",           lote: 4, url: "https://pje.tjma.jus.br/segundograu/ConsultaPublica/listView.seam" },
  { id: "tjpb",           nome: "TJPB - PJe",                sub: "Tribunal de Justiça PB",           grupo: "PB",           lote: 4, url: "https://pje.tjpb.jus.br/pje/login.seam" },
  { id: "tjal",           nome: "TJAL - PJe",                sub: "Tribunal de Justiça AL",           grupo: "AL",           lote: 4, url: "https://pje.tjal.jus.br/pje/login.seam" },

  // =====================================================================
  // LOTE 5: NORDESTE (AL, PB, RN, SE, PI, MA)
  // =====================================================================
  { id: "trt13",          nome: "TRT13 - PJe (PB)",          sub: "TRT Paraíba",                      grupo: "PB",           lote: 5, url: "https://pje.trt13.jus.br/portal-externo/" },
  { id: "trt19",          nome: "TRT19 - PJe (AL)",          sub: "TRT Alagoas",                      grupo: "AL",           lote: 5, url: "https://pje.trt19.jus.br/portal-externo/" },
  { id: "trt20",          nome: "TRT20 - PJe (SE)",          sub: "TRT Sergipe",                      grupo: "SE",           lote: 5, url: "https://pje.trt20.jus.br/portal-externo/" },
  { id: "trt21",          nome: "TRT21 - PJe (RN)",          sub: "TRT Rio Grande do Norte",          grupo: "RN",           lote: 5, url: "https://pje.trt21.jus.br/portal-externo/" },
  { id: "trt22",          nome: "TRT22 - PJe (PI)",          sub: "TRT Piauí",                        grupo: "PI",           lote: 5, url: "https://pje.trt22.jus.br/portal-externo/" },
  { id: "trt16",          nome: "TRT16 - PJe (MA)",          sub: "TRT Maranhão",                     grupo: "MA",           lote: 5, url: "https://pje.trt16.jus.br/portal-externo/" },
  { id: "tjes_esaj",      nome: "TJES - e‑SAJ",              sub: "Tribunal de Justiça ES",           grupo: "ES",           lote: 5, url: "https://esaj.tjes.jus.br/sajcas/login" },
  { id: "trt17",          nome: "TRT17 - PJe (ES)",          sub: "TRT Espírito Santo",               grupo: "ES",           lote: 5, url: "https://pje.trt17.jus.br/portal-externo/" },
  { id: "tjro",           nome: "TJRO - PJe",                sub: "Tribunal de Justiça RO",           grupo: "RO",           lote: 5, url: "https://pje.tjro.jus.br/pje/login.seam" },
  { id: "tjrr",           nome: "TJRR - PJe",                sub: "Tribunal de Justiça RR",           grupo: "RR",           lote: 5, url: "https://pje.tjrr.jus.br/pje/login.seam" },
  { id: "tjap",           nome: "TJAP - PJe",                sub: "Tribunal de Justiça AP",           grupo: "AP",           lote: 5, url: "https://pje.tjap.jus.br/pje/login.seam" },
  { id: "tjac",           nome: "TJAC - PJe",                sub: "Tribunal de Justiça AC",           grupo: "AC",           lote: 5, url: "https://pje.tjac.jus.br/pje/login.seam" },

  // =====================================================================
  // LOTE 6: NORTE (AM, PA, RO, RR, AP, AC, TO)
  // =====================================================================
  { id: "tjam",           nome: "TJAM - PJe",                sub: "Tribunal de Justiça AM",           grupo: "AM",           lote: 6, url: "https://pje.tjam.jus.br/pje/login.seam" },
  { id: "tjpa",           nome: "TJPA - PJe",                sub: "Tribunal de Justiça PA",           grupo: "PA",           lote: 6, url: "https://pje.tjpa.jus.br/segundograu/ConsultaPublica/listView.seam" },
  { id: "tjto",           nome: "TJTO - PJe",                sub: "Tribunal de Justiça TO",           grupo: "TO",           lote: 6, url: "https://pje.tjto.jus.br/pje/login.seam" },
  { id: "trt8",           nome: "TRT8 - PJe (PA, AP)",       sub: "TRT Pará/Amapá",                   grupo: "PA",           lote: 6, url: "https://pje.trt8.jus.br/portal-externo/" },
  { id: "trt11",          nome: "TRT11 - PJe (AM, RR)",      sub: "TRT Amazonas/Roraima",             grupo: "AM",           lote: 6, url: "https://pje.trt11.jus.br/portal-externo/" },
  { id: "trt14",          nome: "TRT14 - PJe (RO, AC)",      sub: "TRT Rondônia/Acre",                grupo: "RO",           lote: 6, url: "https://pje.trt14.jus.br/portal-externo/" },
  { id: "trt2",           nome: "TRT2 - PJe (SP)",           sub: "TRT São Paulo",                    grupo: "SP",           lote: 6, url: "https://pje.trt2.jus.br/portal-externo/" }, // Já está no lote 2, mas TRT2 é grande, pode ser duplicado para balancear
  { id: "trt3",           nome: "TRT3 - PJe (MG)",           sub: "TRT Minas Gerais",                 grupo: "MG",           lote: 6, url: "https://pje.trt3.jus.br/portal-externo/" },
  { id: "trt9_1g",        nome: "TRT9 - PJe 1º Grau (PR)",   sub: "TRT Paraná",                       grupo: "PR",           lote: 6, url: "https://pje.trt9.jus.br/pje/pje-presente.html" },
  { id: "trt9_2g",        nome: "TRT9 - PJe 2º Grau (PR)",   sub: "TRT Paraná",                       grupo: "PR",           lote: 6, url: "https://pje.trt9.jus.br/pje2g/pje-presente.html" },

  // =====================================================================
  // LOTE 7: TRTs (Parte 1)
  // =====================================================================
  { id: "trt3",           nome: "TRT3 - PJe (MG)",           sub: "TRT Minas Gerais",                 grupo: "MG",           lote: 7, url: "https://pje.trt3.jus.br/portal-externo/" },
  { id: "trt4",           nome: "TRT4 - PJe (RS)",           sub: "TRT Rio Grande do Sul",            grupo: "RS",           lote: 7, url: "https://pje.trt4.jus.br/portal-externo/" },
  { id: "trt5",           nome: "TRT5 - PJe (BA)",           sub: "TRT Bahia",                        grupo: "BA",           lote: 7, url: "https://pje.trt5.jus.br/portal-externo/" },
  { id: "trt6",           nome: "TRT6 - PJe (PE)",           sub: "TRT Pernambuco",                   grupo: "PE",           lote: 7, url: "https://pje.trt6.jus.br/portal-externo/" },
  { id: "trt7",           nome: "TRT7 - PJe (CE)",           sub: "TRT Ceará",                        grupo: "CE",           lote: 7, url: "https://pje.trt7.jus.br/portal-externo/" },
  { id: "trt8",           nome: "TRT8 - PJe (PA, AP)",       sub: "TRT Pará/Amapá",                   grupo: "PA",           lote: 7, url: "https://pje.trt8.jus.br/portal-externo/" },
  { id: "trt10",          nome: "TRT10 - PJe (DF, TO)",      sub: "TRT Distrito Federal/Tocantins",   grupo: "DF",           lote: 7, url: "https://pje.trt10.jus.br/portal-externo/" },
  { id: "trt11",          nome: "TRT11 - PJe (AM, RR)",      sub: "TRT Amazonas/Roraima",             grupo: "AM",           lote: 7, url: "https://pje.trt11.jus.br/portal-externo/" },
  { id: "trt12",          nome: "TRT12 - PJe (SC)",          sub: "TRT Santa Catarina",               grupo: "SC",           lote: 7, url: "https://pje.trt12.jus.br/portal-externo/" },
  { id: "trt13",          nome: "TRT13 - PJe (PB)",          sub: "TRT Paraíba",                      grupo: "PB",           lote: 7, url: "https://pje.trt13.jus.br/portal-externo/" },
  { id: "trt14",          nome: "TRT14 - PJe (RO, AC)",      sub: "TRT Rondônia/Acre",                grupo: "RO",           lote: 7, url: "https://pje.trt14.jus.br/portal-externo/" },
  { id: "trt16",          nome: "TRT16 - PJe (MA)",          sub: "TRT Maranhão",                     grupo: "MA",           lote: 7, url: "https://pje.trt16.jus.br/portal-externo/" },

  // =====================================================================
  // LOTE 8: TRTs (Parte 2)
  // =====================================================================
  { id: "trt17",          nome: "TRT17 - PJe (ES)",          sub: "TRT Espírito Santo",               grupo: "ES",           lote: 8, url: "https://pje.trt17.jus.br/portal-externo/" },
  { id: "trt18",          nome: "TRT18 - PJe (GO)",          sub: "TRT Goiás",                        grupo: "GO",           lote: 8, url: "https://pje.trt18.jus.br/portal-externo/" },
  { id: "trt19",          nome: "TRT19 - PJe (AL)",          sub: "TRT Alagoas",                      grupo: "AL",           lote: 8, url: "https://pje.trt19.jus.br/portal-externo/" },
  { id: "trt20",          nome: "TRT20 - PJe (SE)",          sub: "TRT Sergipe",                      grupo: "SE",           lote: 8, url: "https://pje.trt20.jus.br/portal-externo/" },
  { id: "trt21",          nome: "TRT21 - PJe (RN)",          sub: "TRT Rio Grande do Norte",          grupo: "RN",           lote: 8, url: "https://pje.trt21.jus.br/portal-externo/" },
  { id: "trt22",          nome: "TRT22 - PJe (PI)",          sub: "TRT Piauí",                        grupo: "PI",           lote: 8, url: "https://pje.trt22.jus.br/portal-externo/" },
  { id: "trt23",          nome: "TRT23 - PJe (MT)",          sub: "TRT Mato Grosso",                  grupo: "MT",           lote: 8, url: "https://pje.trt23.jus.br/portal-externo/" },
  { id: "trt24",          nome: "TRT24 - PJe (MS)",          sub: "TRT Mato Grosso do Sul",           grupo: "MS",           lote: 8, url: "https://pje.trt24.jus.br/portal-externo/" },
  { id: "trt9_1g",        nome: "TRT9 - PJe 1º Grau (PR)",   sub: "TRT Paraná",                       grupo: "PR",           lote: 8, url: "https://pje.trt9.jus.br/pje/pje-presente.html" },
  { id: "trt9_2g",        nome: "TRT9 - PJe 2º Grau (PR)",   sub: "TRT Paraná",                       grupo: "PR",           lote: 8, url: "https://pje.trt9.jus.br/pje2g/pje-presente.html" },

  // =====================================================================
  // LOTE 9: TJs RESTANTES (Parte 1)
  // =====================================================================
  { id: "tjac",           nome: "TJAC - PJe",                sub: "Tribunal de Justiça AC",           grupo: "AC",           lote: 9, url: "https://pje.tjac.jus.br/pje/login.seam" },
  { id: "tjal",           nome: "TJAL - PJe",                sub: "Tribunal de Justiça AL",           grupo: "AL",           lote: 9, url: "https://pje.tjal.jus.br/pje/login.seam" },
  { id: "tjam",           nome: "TJAM - PJe",                sub: "Tribunal de Justiça AM",           grupo: "AM",           lote: 9, url: "https://pje.tjam.jus.br/pje/login.seam" },
  { id: "tjap",           nome: "TJAP - PJe",                sub: "Tribunal de Justiça AP",           grupo: "AP",           lote: 9, url: "https://pje.tjap.jus.br/pje/login.seam" },
  { id: "tjba",           nome: "TJBA - PJe",                sub: "Tribunal de Justiça BA",           grupo: "BA",           lote: 9, url: "https://pje.tjba.jus.br/pje/login.seam" },
  { id: "tjce",           nome: "TJCE - PJe",                sub: "Tribunal de Justiça CE",           grupo: "CE",           lote: 9, url: "https://pje.tjce.jus.br/pje/login.seam" },
  { id: "tjdf",           nome: "TJDFT - PJe",               sub: "Tribunal de Justiça DF",           grupo: "DF",           lote: 9, url: "https://pje.tjdft.jus.br/pje/login.seam" },
  { id: "tjes",           nome: "TJES - PJe",                sub: "Tribunal de Justiça ES",           grupo: "ES",           lote: 9, url: "https://pje.tjes.jus.br/pje/login.seam" },
  { id: "tjgo",           nome: "TJGO - PJe",                sub: "Tribunal de Justiça GO",           grupo: "GO",           lote: 9, url: "https://pje.tjgo.jus.br/pje/login.seam" },
  { id: "tjma",           nome: "TJMA - PJe",                sub: "Tribunal de Justiça MA",           grupo: "MA",           lote: 9, url: "https://pje.tjma.jus.br/segundograu/ConsultaPublica/listView.seam" },
  { id: "tjmg",           nome: "TJMG - PJe",                sub: "Tribunal de Justiça MG",           grupo: "MG",           lote: 9, url: "https://pje.tjmg.jus.br/pje/login.seam" },
  { id: "tjms",           nome: "TJMS - PJe",                sub: "Tribunal de Justiça MS",           grupo: "MS",           lote: 9, url: "https://pje.tjms.jus.br/pje/login.seam" },

  // =====================================================================
  // LOTE 10: TJs RESTANTES (Parte 2)
  // =====================================================================
  { id: "tjmt",           nome: "TJMT - PJe",                sub: "Tribunal de Justiça MT",           grupo: "MT",           lote: 10, url: "https://pje.tjmt.jus.br/segundograu/ConsultaPublica/listView.seam" },
  { id: "tjpa",           nome: "TJPA - PJe",                sub: "Tribunal de Justiça PA",           grupo: "PA",           lote: 10, url: "https://pje.tjpa.jus.br/segundograu/ConsultaPublica/listView.seam" },
  { id: "tjpb",           nome: "TJPB - PJe",                sub: "Tribunal de Justiça PB",           grupo: "PB",           lote: 10, url: "https://pje.tjpb.jus.br/pje/login.seam" },
  { id: "tjpe",           nome: "TJPE - PJe",                sub: "Tribunal de Justiça PE",           grupo: "PE",           lote: 10, url: "https://pje.tjpe.jus.br/pje/login.seam" },
  { id: "tjpi",           nome: "TJPI - PJe",                sub: "Tribunal de Justiça PI",           grupo: "PI",           lote: 10, url: "https://pje.tjpi.jus.br/pje/login.seam" },
  { id: "tjpr",           nome: "TJPR - PJe",                sub: "Tribunal de Justiça PR",           grupo: "PR",           lote: 10, url: "https://pje.tjpr.jus.br/pje/login.seam" }, // PJe do TJPR
  { id: "tjrj",           nome: "TJRJ - PJe",                sub: "Tribunal de Justiça RJ",           grupo: "RJ",           lote: 10, url: "https://pje.tjrj.jus.br/pje/login.seam" },
  { id: "tjrn",           nome: "TJRN - PJe",                sub: "Tribunal de Justiça RN",           grupo: "RN",           lote: 10, url: "https://pje.tjrn.jus.br/pje/login.seam" },
  { id: "tjro",           nome: "TJRO - PJe",                sub: "Tribunal de Justiça RO",           grupo: "RO",           lote: 10, url: "https://pje.tjro.jus.br/pje/login.seam" },
  { id: "tjrr",           nome: "TJRR - PJe",                sub: "Tribunal de Justiça RR",           grupo: "RR",           lote: 10, url: "https://pje.tjrr.jus.br/pje/login.seam" },
  { id: "tjrs",           nome: "TJRS - PJe",                sub: "Tribunal de Justiça RS",           grupo: "RS",           lote: 10, url: "https://pje.tjrs.jus.br/pje/login.seam" },
  { id: "tjsc",           nome: "TJSC - PJe",                sub: "Tribunal de Justiça SC",           grupo: "SC",           lote: 10, url: "https://pje.tjsc.jus.br/pje/login.seam" },
  { id: "tjse",           nome: "TJSE - PJe",                sub: "Tribunal de Justiça SE",           grupo: "SE",           lote: 10, url: "https://pje.tjse.jus.br/pje/login.seam" },
  { id: "tjto",           nome: "TJTO - PJe",                sub: "Tribunal de Justiça TO",           grupo: "TO",           lote: 10, url: "https://pje.tjto.jus.br/pje/login.seam" }
];

export default tribunais;
