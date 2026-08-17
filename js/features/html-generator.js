/**
 * ============================================================================
 * HTML-GENERATOR.JS - Gerador de HTML Standalone (100% Offline)
 * ============================================================================
 */

const HTMLGenerator = (() => {
  const removerScriptsDev = (rootEl) => {
    rootEl.querySelectorAll('script').forEach((sc) => {
      const conteudo = sc.textContent || '';
      const src = sc.getAttribute('src') || '';
      if (
        conteudo.includes('IsThisFirstTime_Log_From_LiveServer') ||
        src.includes('dependency-loader') ||
        src.includes('live-server')
      ) {
        sc.remove();
      }
    });
  };

  const generate = async (data) => {
    const clone = document.documentElement.cloneNode(true);
    removerScriptsDev(clone);

    const toastClone = clone.querySelector('#toast');
    if (toastClone) {
      toastClone.classList.remove('show');
      toastClone.textContent = '📄 Ficha salva no PC!';
    }

    // Remove scripts antigos de exportações anteriores
    clone.querySelectorAll('#__dados_exportados__, #__motor_autonomo_offline__').forEach(el => el.remove());

    const jsonState = JSON.stringify(data || {})
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');

    // Injeta os dados puros em JSON
    const dataScript = document.createElement('script');
    dataScript.id = '__dados_exportados__';
    dataScript.type = 'application/json';
    dataScript.textContent = jsonState;
    clone.querySelector('head')?.appendChild(dataScript);

    // Motor que roda automaticamente ao abrir o arquivo baixado
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
          }

          if (dados['bg-pattern'] && typeof applyBgPattern === 'function') {
            applyBgPattern(dados['bg-pattern']);
            const bgSelect = document.getElementById('bg-pattern');
            if (bgSelect) bgSelect.value = dados['bg-pattern'];
          }

          if (dados._bgImage && typeof aplicarFundoCustomizado === 'function') {
            imagemFundoCustomizada = dados._bgImage;
            aplicarFundoCustomizado();
          }
        } catch (e) {
          console.error('Erro na restauração offline:', e);
        }
      });
    `;
    clone.querySelector('body')?.appendChild(autoRestoreScript);

    return '<!DOCTYPE html>\n' + clone.outerHTML;
  };

  const download = async () => {
    try {
      if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show('⏳ Gerando arquivo...');
      }

      // Fecha previews abertas de notas antes do dump
      document.querySelectorAll('.rn-toggle').forEach(btn => {
        if (btn.textContent.trim() === '👁') {
          btn.click();
        }
      });

      const data = typeof collectData === 'function' ? collectData() : {};
      const htmlContent = await generate(data);

      const rawName = data['char-name'] || document.getElementById('char-name')?.value || 'personagem';
      const safeName = rawName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'ficha';

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ficha_${safeName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show('📄 Ficha exportada com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao salvar HTML:', err);
      if (typeof Toast !== 'undefined' && Toast.show) {
        Toast.show('❌ Erro ao exportar HTML.');
      }
    }
  };

  return { generate, download };
})();