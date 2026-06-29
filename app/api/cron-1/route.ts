  const testUrl = async (trib: any, attempt = 1): Promise<void> => {
    let statusFinal = 'offline';
    let pingFinal = 0;
    let realLatency = 0;
    let detalheFinal = '';
    let currentUrl = trib.url; // Usaremos esta variável para a URL atual da requisição

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const start = Date.now();

      let response = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        signal: controller.signal,
        cache: 'no-store',
        redirect: 'follow' // Garante que redirecionamentos HTTP 3xx são seguidos
      });
      clearTimeout(timeoutId);

      let totalTime = Date.now() - start;
      let content = await response.text();
      let contentLower = content.toLowerCase();

      // --- Lógica para seguir Meta Refresh ---
      const metaRefreshMatch = content.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;url=([^"']+)["']/i);
      if (response.ok && metaRefreshMatch && metaRefreshMatch[1]) {
        const redirectUrl = new URL(metaRefreshMatch[1], currentUrl).toString(); // Resolve URLs relativas
        console.log(`DEBUG: Meta Refresh detectado para ${trib.name}. Redirecionando para: ${redirectUrl}`);
        
        // Faz uma nova requisição para a URL do meta refresh
        const startMetaRefresh = Date.now();
        response = await fetch(redirectUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          signal: controller.signal, // Usa o mesmo controller para o timeout
          cache: 'no-store',
          redirect: 'follow'
        });
        clearTimeout(timeoutId); // Limpa novamente caso tenha sido setado para a segunda requisição
        totalTime += (Date.now() - startMetaRefresh); // Adiciona o tempo da segunda requisição
        content = await response.text();
        contentLower = content.toLowerCase();
        currentUrl = redirectUrl; // Atualiza a URL atual para fins de log, se necessário
      }
      // --- Fim da Lógica Meta Refresh ---

      // Check de veracidade inteligente:
      const isCloudflareChallenge = contentLower.includes('<title>just a moment...</title>') || contentLower.includes('cloudflare-nginx');
      const isWafBlock = contentLower.includes('access denied') && contentLower.includes('reference #');
      
      const isValidContent = content.length > 500 && !isCloudflareChallenge && !isWafBlock;

      if (response.ok && isValidContent) {
        const VERCEL_OVERHEAD = 150;
        realLatency = Math.max(totalTime - VERCEL_OVERHEAD, 15);

        statusFinal = realLatency > 6000 ? 'instavel' : 'online';
        pingFinal = realLatency;
        detalheFinal = 'Sucesso';
      } else {
        statusFinal = 'offline';
        if (!response.ok) {
          detalheFinal = `Erro HTTP: ${response.status}`;
        } else if (isCloudflareChallenge || isWafBlock) {
          detalheFinal = 'Bloqueado por Firewall/WAF';
        } else {
          detalheFinal = 'Conteúdo inválido ou muito curto';
          console.log(`DEBUG: Tribunal ${trib.name} (${currentUrl}) - Conteúdo recebido (primeiros 500 chars): ${content.substring(0, 500)}`);
        }
      }
    } catch (error: any) {
      if (attempt === 1 && (error.message === 'fetch failed' || error.name === 'AbortError')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return testUrl(trib, 2);
      }
      statusFinal = 'offline';
      detalheFinal = `Falha (Tentativa ${attempt}): ${error.name === 'AbortError' ? 'Timeout' : error.message}`;
    }

    statuses[trib.name] = statusFinal;
    pings[trib.name] = pingFinal;
    relatorio.push({
      tribunal: trib.name,
      url: trib.url, // URL original
      status: statusFinal,
      ping_ms: pingFinal,
      detalhe: detalheFinal
    });
  };
