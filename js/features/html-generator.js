/**
 * ============================================================================
 * HTML-GENERATOR.JS - Módulo Clássico (Rehidratação via JSON)
 * ============================================================================
 */

const HTMLGenerator = (() => {
  const limparEsqueleto = (rootEl) => {
    // Remove o lixo dinâmico para garantir que o "esqueleto" fique limpo
    rootEl.querySelectorAll('#clr-picker, #clr-style').forEach(el => el.remove());
    
    // Remove scripts antigos ou de desenvolvimento para não duplicar
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

  const generate = async (data) => {
    // 1. Clona o DOM atual. (O clone não copia os valores digitados nativamente, 
    // o que é perfeito para criar um template HTML "limpo")
    const clone = document.documentElement.cloneNode(true);
    
    // 2. Limpa o esqueleto HTML
    limparEsqueleto(clone);

    // 3. A mágica da ficha antiga: Empacota TUDO em um único Script JSON estático
    const jsonState = JSON.stringify(data || {})
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');

    const dataScript = document.createElement('script');
    dataScript.id = '__dados_exportados__';
    dataScript.type = 'application/json';
    dataScript.textContent = jsonState;
    
    // Injeta o "cofre de dados" no head da ficha
    clone.querySelector('head')?.appendChild(dataScript);

    return '<!DOCTYPE html>\n' + clone.outerHTML;
  };

  const download = async () => {
    try {
      if (typeof Toast !== 'undefined' && Toast.show) Toast.show('⏳ Salvando dados da ficha...');

      // Coleta os dados usando a função do seu sistema
      const data = (typeof window.CharacterDataHelper !== 'undefined' && window.CharacterDataHelper.collectData)
        ? window.CharacterDataHelper.collectData()
        : (typeof collectData === 'function' ? collectData() : {});

      // Gera o HTML usando a lógica de JSON
      const htmlContent = await generate(data);

      const rawName = data['char-name'] || document.getElementById('char-name')?.value || 'personagem';
      const safeName = rawName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'ficha';

      // Cria e dispara o download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ficha_${safeName}.html`;
      
      a.click();
      URL.revokeObjectURL(url);

      if (typeof Toast !== 'undefined' && Toast.show) Toast.show('📄 Ficha exportada (Modo JSON)!');
    } catch (err) {
      console.error('Erro ao gerar/baixar HTML:', err);
      if (typeof Toast !== 'undefined' && Toast.show) Toast.show('❌ Erro ao exportar.');
    }
  };

  return { generate, download };
})();
