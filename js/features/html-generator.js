/**
 * ============================================================================
 * HTML-GENERATOR.JS - Ficha OSS Monolítica (Rehidratação + CSS/JS Embutidos)
 * ============================================================================
 */

const HTMLGenerator = (() => {
  const limparEsqueleto = (rootEl) => {
    rootEl.querySelectorAll('#clr-picker, #clr-style').forEach(el => el.remove());
    
    const scripts = Array.from(rootEl.getElementsByTagName('script'));
    scripts.forEach((sc) => {
      const conteudo = sc.textContent || '';
      if (
        sc.id === '__dados_exportados__' || 
        conteudo.includes('IsThisFirstTime_Log_From_LiveServer')
      ) {
        if (sc.parentNode) sc.parentNode.removeChild(sc);
      }
    });
  };

  // NOVA FUNÇÃO: Transforma links e scripts externos em código embutido
  const embutirRecursosLocais = async (clone) => {
    // 1. Embutir CSS local
    const linksCss = Array.from(clone.querySelectorAll('link[rel="stylesheet"]'));
    for (const link of linksCss) {
      const href = link.getAttribute('href');
      // Ignora links externos (como Google Fonts e Coloris CDN)
      if (href && !href.startsWith('http')) {
        try {
          const resposta = await fetch(href);
          const cssTexto = await resposta.text();
          const tagStyle = document.createElement('style');
          tagStyle.textContent = cssTexto;
          link.replaceWith(tagStyle);
        } catch (erro) {
          console.warn(`⚠️ Não foi possível embutir o CSS: ${href}`, erro);
        }
      }
    }

    // 2. Embutir JS local
    const scriptsJs = Array.from(clone.querySelectorAll('script[src]'));
    for (const script of scriptsJs) {
      const src = script.getAttribute('src');
      // Ignora links externos (como PDF.js e Cropper.js CDNs)
      if (src && !src.startsWith('http')) {
        try {
          const resposta = await fetch(src);
          const jsTexto = await resposta.text();
          const tagScript = document.createElement('script');
          tagScript.textContent = jsTexto;
          script.replaceWith(tagScript);
        } catch (erro) {
          console.warn(`⚠️ Não foi possível embutir o JS: ${src}`, erro);
        }
      }
    }
  };

  const generate = async (data) => {
    const clone = document.documentElement.cloneNode(true);
    
    // Transforma a ficha em um arquivo único (Monolito)
    await embutirRecursosLocais(clone);

    limparEsqueleto(clone);

    const jsonState = JSON.stringify(data || {})
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');

    const dataScript = document.createElement('script');
    dataScript.id = '__dados_exportados__';
    dataScript.type = 'application/json';
    dataScript.textContent = jsonState;
    
    clone.querySelector('head')?.appendChild(dataScript);

    return '<!DOCTYPE html>\n' + clone.outerHTML;
  };

  const download = async () => {
    try {
      if (typeof Toast !== 'undefined' && Toast.show) Toast.show('⏳ Empacotando ficha completa...');

      const data = (typeof window.CharacterDataHelper !== 'undefined' && window.CharacterDataHelper.collectData)
        ? window.CharacterDataHelper.collectData()
        : (typeof collectData === 'function' ? collectData() : {});

      const htmlContent = await generate(data);

      const rawName = data['char-name'] || document.getElementById('char-name')?.value || 'personagem';
      const safeName = rawName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'ficha';

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ficha_${safeName}.html`;
      
      a.click();
      URL.revokeObjectURL(url);

      if (typeof Toast !== 'undefined' && Toast.show) Toast.show('📄 Ficha exportada com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar/baixar HTML:', err);
      if (typeof Toast !== 'undefined' && Toast.show) Toast.show('❌ Erro ao exportar.');
    }
  };

  return { generate, download };
})();
