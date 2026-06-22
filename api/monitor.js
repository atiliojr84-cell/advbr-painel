// api/monitor.js - Motor Inteligente de Varredura por Lotes (ADVBR.info)
const tribunais = require('./alvos');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    // Captura o lote pela URL (Ex: /api/monitor?lote=1). Se não passar nenhum, padroniza lote 1.
    const loteDefinido = req.query.lote ? parseInt(req.query.lote) : 1;

    // Filtra na base de dados para testar APENAS os tribunais do lote escolhido
    const alvosDoLote = tribunais.filter(t => t.lote === loteDefinido);

    const resultados = [];

    for (const t of alvosDoLote) {
        let somasLatencia = 0;
        let tentativasSucesso = 0;
        let ultimoCodigoHttp = null;
        let mensagemErro = null;

        // Executa 3 pings rápidos para garantir a precisão
        for (let i = 0; i < 3; i++) {
            const inicio = Date.now();
            try {
                const resposta = await fetch(t.url, { 
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                    },
                    signal: AbortSignal.timeout(3000) // Timeout de 3 segundos por tentativa
                });

                const latenciaTentativa = Date.now() - inicio;
                somasLatencia += latenciaTentativa;
                tentativasSucesso++;
                ultimoCodigoHttp = resposta.status;

            } catch (erro) {
                mensagemErro = erro.message;
                continue;
            }
        }

        if (tentativasSucesso > 0) {
            const latenciaMedia = Math.round(somasLatencia / tentativasSucesso);
            let status = "Online";
            if (latenciaMedia > 1500) status = "Lentidão";

            resultados.push({
                id: t.id,
                nome: t.nome,
                grupo: t.grupo,
                status: status,
                latenciaMs: latenciaMedia,
                codigoHttp: ultimoCodigoHttp,
                lote: t.lote
            });
        } else {
            resultados.push({
                id: t.id,
                nome: t.nome,
                grupo: t.grupo,
                status: "Fora do Ar",
                latenciaMs: null,
                erro: mensagemErro || "Timeout nas 3 tentativas",
                lote: t.lote
            });
        }
    }

    return res.status(200).json(resultados);
}
