const testUrl = async (trib: any, attempt = 1): Promise<void> => {
    let statusFinal = 'offline';
    let pingFinal = 0;
    let realLatency = 0;
    let detalheFinal = '';
    let currentUrl = trib.url;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const start = Date.now();

      let finalResponse = await fetch(currentUrl, {
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
        redirect: 'follow'
      });
      clearTimeout(timeoutId);

      let totalTime = Date.now() - start;
      let finalContent = await finalResponse.text();
      let finalContentLower = finalContent.toLowerCase();

      const metaRefreshMatch = finalContent.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;url=([^"']+)["']/i);
      if (finalResponse.ok && metaRefreshMatch && metaRefreshMatch[1]) {
        const redirectUrl = new URL(metaRefreshMatch[1], currentUrl).toString();
        console.log(`DEBUG: Meta Refresh detectado para ${trib.name}. Redirecionando para: ${redirectUrl}`);
        
        const startMetaRefresh = Date.now();
        finalResponse = await fetch(redirectUrl, {
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
          redirect: 'follow'
        });
        clearTimeout(timeoutId);
        totalTime += (Date.now() - startMetaRefresh);
        finalContent = await finalResponse.text();
        finalContentLower = finalContent.toLowerCase();
        currentUrl = redirectUrl;
      }

      // Check de veracidade inteligente:
      const isCloudflareChallenge = finalContentLower.includes('<title>just a moment...</title>') || finalContentLower.includes('cloudflare-nginx');
      const isWafBlock = finalContentLower.includes('access denied') && finalContentLower.includes('reference #');
      
      let minContentLength = 500;
      // Reduz o mínimo para sites PJe ou TRT, que podem ter páginas de login mais curtas
      if (currentUrl.includes('pje.') || currentUrl.includes('trt')) {
        minContentLength = 100; // Considera 100 caracteres como mínimo para essas páginas
      }

      const isValidContent = finalContent.length > minContentLength && !isCloudflareChallenge && !isWafBlock;

      if (finalResponse.ok && isValidContent) {
        const VERCEL_OVERHEAD = 150;
        realLatency = Math.max(totalTime - VERCEL_OVERHEAD, 15);

        statusFinal = realLatency > 6000 ? 'instavel' : 'online';
        pingFinal = realLatency;
        detalheFinal = 'Sucesso';
      } else {
        statusFinal = 'offline';
        if (!finalResponse.ok) {
          detalheFinal = `Erro HTTP: ${finalResponse.status}`;
        } else if (isCloudflareChallenge || isWafBlock) {
          detalheFinal = 'Bloqueado por Firewall/WAF';
        } else {
          detalheFinal = 'Conteúdo inválido ou muito curto';
          console.log(`DEBUG: Tribunal ${trib.name} (${currentUrl}) - Conteúdo recebido (primeiros 500 chars): ${finalContent.substring(0, 500)}`);
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
      url: trib.url,
      status: statusFinal,
      ping_ms: pingFinal,
      detalhe: detalheFinal
    });
  };
