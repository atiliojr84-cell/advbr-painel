// api/alvos.js
// Lista MÍNIMA de tribunais para fazer o index.html atual funcionar.
// Distribuídos em 2 lotes para teste rápido.

const baseTribunais = [
    // --- LOTE 1: Tribunais Superiores e Nacionais ---
    { id: "stf", url: "https://portal.stf.jus.br/" },
    { id: "stj", url: "https://www.stj.jus.br/" },
    { id: "tse", url: "https://www.tse.jus.br/" },
    { id: "tst", url: "https://www.tst.jus.br/" },
    { id: "cnj", url: "https://www.cnj.jus.br/" },
    { id: "pje_cnj", url: "https://pje.cnj.jus.br/primeirograu/login.seam" },
    { id: "domicilio_cnj", url: "https://www.cnj.jus.br/servicos/consulta-processual/" },

    // --- LOTE 2: Paraná (PR) ---
    { id: "tjpr_eproc_1g", url: "https://eproc1g.tjpr.jus.br/eproc/externo_controlador.php?acao=principal" },
    { id: "tjpr_projudi", url: "https://projudi.tjpr.jus.br/projudi/" },
    { id: "trt9_1g", url: "https://pje.trt9.jus.br/primeirograu/login.seam" },
    { id: "trt9_2g", url: "https://pje.trt9.jus.br/segundograu/login.seam" },
    { id: "trf4_pr", url: "https://www.trf4.jus.br/trf4/controlador.php?acao=pagina_inicial" }
];

const tribunais = baseTribunais.map((t, index) => ({
    ...t,
    lote: (index % 2) + 1 // Distribui em 2 lotes para agilizar o teste
}));

export default tribunais;
