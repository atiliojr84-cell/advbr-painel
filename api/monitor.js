// api/monitor.js - O motor de varredura do ADVBR.info
const tribunais = require('./alvos');

export default async function handler(req, res) {
    // Adiciona cabeçalhos para permitir que qualquer navegador leia a API (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const resultados = [];

    // Varre a lista de tribunais testando um por um
    for (const t of tribunais) {
        const inicio = Date.now();
        try {
            // Faz uma chamada rápida (HEAD) para gastar menos banda
            const resposta = await fetch(t.url, { 
                method: 'HEAD', 
                signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
            });

            const latencia = Date.now() - inicio;

            let status = "Online";
            if (latencia > 1500) status = "Lentidão";

            resultados.push({
                id: t.id,
                nome: t.nome,
                grupo: t.grupo,
                status: status,
                latenciaMs: latencia,
                codigoHttp: resposta.status
            });
        } catch (erro) {
            // Se der timeout ou erro de rede, joga para Fora do Ar
            resultados.push({
                id: t.id,
                nome: t.nome,
                grupo: t.grupo,
                status: "Fora do Ar",
                latenciaMs: null,
                erro: erro.message
            });
        }
    }

    // Retorna a lista mastigada com o status real de cada um
    return res.status(200).json(resultados);
}
