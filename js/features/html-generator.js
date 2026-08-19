/**
 * ============================================================================
 * HTML-GENERATOR.JS - OSS Dinâmico (Rehidratação JSON + Embutir CSS/JS)
 * ============================================================================
 */

const HTMLGenerator = (() => {
  const limparEsqueleto = (rootEl) => {
    // Remove interface dinâmica
    rootEl.querySelectorAll('#clr-picker, #clr-style').forEach(el => el.remove());
    
    // Remove scripts de dados antigos
    const scripts = Array.from(rootEl.getElementsByTagName('script'));
    scripts.forEach((sc) => {
      if (sc.id === '__dados_exportados__' || sc.textContent.includes('LiveServer')) {
        if (sc.parentNode) sc.parentNode.removeChild(sc);
      }
    });
  };

  const embutirRecursosLocais = async (clone) => {
    // 1. Embutir CSS
    const linksCss = Array.from(clone.querySelectorAll('link[rel="stylesheet"]'));
    for (const link of linksCss) {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        try {
          const resp = await fetch(href);
          const css = await resp.text();
          const style = document.createElement('style');
          style.textContent = css;
          link.replaceWith(style);
        } catch (e) { console.warn(`Falha no CSS: ${href}`, e); }
      }
    }

    // 2. Embutir JS
    const scriptsJs = Array.from(clone.querySelectorAll('script[src]'));
    for (const sc of scriptsJs) {
      const src = sc.getAttribute('src');
      if (src && !src.startsWith('http')) {
        try {
          const resp = await fetch(src);
          const js = await resp.text();
          const inlineSc = document.createElement('script');
          inlineSc.textContent = js;
          sc.replaceWith(inlineSc);
        } catch (e) { console.warn(`Falha no JS: ${src}`, e); }
      }
    }
  };

  const generate = async (data) => {
    const clone = document.documentElement.cloneNode(true);
    
    // Transforma em arquivo único pegando os arquivos do GitHub
    await embutirRecursosLocais(clone);
    limparEsqueleto(clone);

    // Cria o cofre de dados JSON
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
      if (typeof Toast !== 'undefined' && Toast.show) Toast.show('⏳ Gerando ficha monolítica...');

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
      console.error('Erro:', err);
    }
  };

  return { generate, download };
})();
