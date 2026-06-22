// api/monitor.js - Motor Avançado de Varredura (3 Pings + Mapeamento de Firewall)
const tribunais = require('./alvos');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const resultados = [];

    for (const t of tribunais) {
        let somasLatencia = 0;
        let tentativasSucesso = 0;
        let ultimoCodigoHttp = null;
        let mensagemErro = null;

        // Executa 3 pings seguidos para garantir a fidedignidade
        for (let i = 0; i < 3; i++) {
            const inicio = Date.now();
            try {
                const resposta = await fetch(t.url, { 
                    method: 'GET', // Mudado para GET para evitar bloqueio de alguns firewalls
                    headers: {
                        // Mascara a requisição para parecer um navegador Mac/Chrome real
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                    },
                    signal: AbortSignal.timeout(4000) // 4 segundos de timeout por tentativa
                });

                const latenciaTentativa = Date.now() - inicio;
                somasLatencia += latenciaTentativa;
                tentativasSucesso++;
                ultimoCodigoHttp = resposta.status;

            } catch (erro) {
                mensagemErro = erro.message;
                // Se falhar, apenas continua para a próxima tentativa do mesmo tribunal
                continue;
            }
        }

        // Processa os resultados das 3 tentativas
        if (tentativasSucesso > 0) {
            // Calcula a média aritmética dos pings que deram certo
            const latenciaMedia = Math.round(somasLatencia / tentativasSucesso);
            
            let status = "Online";
            if (latenciaMedia > 1500) status = "Lentidão";

            resultados.push({
                id: t.id,
                nome: t.nome,
                grupo: t.grupo,
                status: status,
                latenciaMs: latenciaMedia,
                codigoHttp: ultimoCodigoHttp
            });
        } else {
            // Se TODAS as 3 tentativas falharem, aí sim acusa Fora do Ar
            resultados.push({
                id: t.id,
                nome: t.nome,
                grupo: t.grupo,
                status: "Fora do Ar",
                latenciaMs: null,
                erro: mensagemErro || "Timeout nas 3 tentativas"
            });
        }
    }

    return res.status(200).json(resultados);
}
