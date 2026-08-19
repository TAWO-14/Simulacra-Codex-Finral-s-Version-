/**
 * ============================================================================
 * HTML-GENERATOR.JS - Gerador de HTML Standalone (100% Offline)
 * ============================================================================
 */

const HTMLGenerator = (() => {
  const escaparHTML = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const limparLixoInjetado = (rootEl) => {
    // 1. Limpa scripts do Live Server e os motores antigos de save
    const scripts = Array.from(rootEl.getElementsByTagName('script'));
    scripts.forEach((sc) => {
      const conteudo = sc.textContent || '';
      const src = sc.getAttribute('src') || '';
      if (
        conteudo.includes('IsThisFirstTime_' + 'Log_From_LiveServer') ||
        src.includes('dependency-' + 'loader') ||
        src.includes('live-' + 'server') ||
        sc.id === '__dados_exportados__' ||
        sc.id === '__motor_autonomo_offline__'
      ) {
        if (sc.parentNode) sc.parentNode.removeChild(sc);
      }
    });

    // 2. Limpa elementos de bibliotecas injetados dinamicamente (como o Coloris)
    // Isso impede que a ficha crie múltiplas paletas invisíveis e engorde 1KB a cada save!
    rootEl.querySelectorAll('#clr-picker, #clr-style').forEach(el => el.remove());
  };

  const embutirCSSTotal = async (rootEl) => {
    const linksCss = Array.from(rootEl.querySelectorAll('link[rel="stylesheet"]'));
    for (const link of linksCss) {
      const href = link.getAttribute('href') || '';
      if (href && !href.startsWith('http') && !href.startsWith('//')) {
        try {
          const resp = await fetch(href);
          if (resp.ok) {
            const cssText = await resp.text();
            const styleEl = document.createElement('style');
            styleEl.setAttribute('data-origin', href);
            styleEl.textContent = cssText;
            link.replaceWith(styleEl);
          }
        } catch (err) {
          console.warn(`[HTMLGenerator] Falha ao embutir CSS: ${href}`, err);
        }
      }
    }
  };

  const embutirJSTotal = async (rootEl) => {
    if (window.location.protocol === 'file:') return; 

    const scripts = Array.from(rootEl.querySelectorAll('script[src]'));
    for (const sc of scripts) {
      const src = sc.getAttribute('src') || '';
      if (src && !src.startsWith('http') && !src.startsWith('//')) {
        try {
          const resp = await fetch(src);
          if (resp.ok) {
            const jsText = await resp.text();
            const inlineSc = document.createElement('script');
            inlineSc.setAttribute('data-origin', src);
            inlineSc.textContent = jsText;
            sc.replaceWith(inlineSc);
          }
        } catch (err) {
          console.warn(`[HTMLGenerator] Falha ao embutir JS: ${src}`, err);
        }
      }
    }
  };

  const generate = async (data) => {
    const clone = document.documentElement.cloneNode(true);
    
    // Roda a limpeza absoluta do clone (Live Server + Coloris + Lixos antigos)
    limparLixoInjetado(clone);

    const toastClone = clone.querySelector('#toast');
    if (toastClone) {
      toastClone.classList.remove('show');
      toastClone.textContent = '📄 Ficha salva no PC!';
    }

    Object.entries(data || {}).forEach(([key, val]) => {
      if (key.startsWith('_')) return;
      
      const el = clone.querySelector(`[id="${key}"]`);
      if (el) {
        if (el.tagName === 'TEXTAREA') {
          el.textContent = val;
        } else if (el.tagName === 'INPUT' && el.type !== 'file') {
          el.setAttribute('value', val);
        } else if (el.tagName === 'SELECT') {
          el.querySelectorAll('option').forEach(opt => {
            if (opt.value === String(val)) opt.setAttribute('selected', 'selected');
            else opt.removeAttribute('selected');
          });
        }
      }
    });

    const jsonState = JSON.stringify(data || {})
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');

    const dataScript = document.createElement('script');
    dataScript.id = '__dados_exportados__';
    dataScript.type = 'application/json';
    dataScript.textContent = jsonState;
    clone.querySelector('head')?.appendChild(dataScript);

    const autoRestoreScript = document.createElement('script');
    autoRestoreScript.id = '__motor_autonomo_offline__';
    autoRestoreScript.textContent = `
      window.addEventListener('DOMContentLoaded', () => {
        const scriptDados = document.getElementById('__dados_exportados__');
        if (!scriptDados || !scriptDados.textContent) return;

        try {
          const dados = JSON.parse(scriptDados.textContent);
          window.SHEET_DATA = dados;

          Object.entries(dados).forEach(([key, value]) => {
            if (key.startsWith('_')) return;
            const el = document.getElementById(key);
            if (el && 'value' in el) el.value = value;
          });

          if (typeof onAttrChange === 'function') onAttrChange();
          if (typeof updateHPBar === 'function') updateHPBar();
          if (typeof updateHeader === 'function') updateHeader();
          if (typeof updateProfBonus === 'function') updateProfBonus();
          
          if (dados._theme && typeof changeTheme === 'function') {
            changeTheme(dados._theme);
            if (typeof window.updateThemeButtonUI === 'function') {
               window.updateThemeButtonUI(dados._theme);
            }
          }

          if (dados['bg-pattern'] && typeof applyBgPattern === 'function') {
            applyBgPattern(dados['bg-pattern']);
            const bgSelect = document.getElementById('bg-pattern');
            if (bgSelect) bgSelect.value = dados['bg-pattern'];
          }

          if (dados._bgImage && typeof aplicarFundoCustomizado === 'function') {
            window.imagemFundoCustomizada = dados._bgImage;
            aplicarFundoCustomizado();
          }
        } catch (e) {
          console.error('Erro na restauração offline:', e);
        }
      });
    `;
    clone.querySelector('body')?.appendChild(autoRestoreScript);

    await embutirCSSTotal(clone);
    await embutirJSTotal(clone);

    return '<!DOCTYPE html>\n' + clone.outerHTML;
  };

  const download = async () => {
    try {
      if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show('⏳ Gerando arquivo standalone...');
      }

      document.querySelectorAll('.rn-toggle').forEach(btn => {
        if (btn.textContent.trim() === '👁') {
          btn.click();
        }
      });

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

      if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show('📄 Ficha exportada com sucesso!');
      } else if (typeof showToast === 'function') {
        showToast('📄 Ficha exportada com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao gerar/baixar HTML:', err);
      if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show('❌ Erro ao exportar HTML.');
      }
    }
  };

  return {
    generate,
    download,
    escaparHTML
  };
})();
