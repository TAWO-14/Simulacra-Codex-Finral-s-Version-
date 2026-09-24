/**
 * =========================================
 * EXPORT-IMPORT.JS - Importação/Exportação de Fichas
 * =========================================
 */

const ExportImportSystem = (() => {

  // ── Coleta de Dados da Ficha Inteira ──
  function collectData() {
    console.group('💾 INICIANDO EXPORTAÇÃO DA FICHA...');
    console.log('1. Sincronizando interface e forçando atualização de variáveis...');

    // Sincroniza magias da interface para o objeto global em memória
    try {
      if (typeof window.spells !== 'undefined' && typeof window.updateActiveSpell === 'function') {
        for (let level = 0; level <= 9; level++) {
          const titleEl = document.getElementById(`spell-title-${level}`);
          const prepEl = document.getElementById(`spell-prep-${level}`);
          const concEl = document.getElementById(`spell-conc-${level}`);
          const descEl = document.getElementById(`spell-desc-${level}`);

          if (titleEl) window.updateActiveSpell(level, 'name', titleEl.value);
          if (prepEl) window.updateActiveSpell(level, 'prepped', prepEl.checked);
          if (concEl) window.updateActiveSpell(level, 'concentration', concEl.checked);
          if (descEl) window.updateActiveSpell(level, 'desc', descEl.value);
        }
      }

      // Sincroniza os slots diretamente da tela
      if (typeof window.spellSlots !== 'undefined' && typeof window.setSlotTotal === 'function') {
        for (let l = 1; l <= 9; l++) {
          const slotInput = document.getElementById(`slot-ov-${l}`);
          if (slotInput) {
            window.setSlotTotal(l, slotInput.value, true);
          }
        }
      }
    } catch (e) {
      console.warn("Aviso: Sincronização forçada das magias falhou. Usando valores em memória.", e);
    }

    const data = {};
    const inputs = document.querySelectorAll('input[id], textarea[id], select[id]');

    // IDs das magias/painéis individuais que não entram no loop comum de campos simples
    const isDetailSpellField = (id) => /^spell-(title|prep|conc|desc|toggle|detail|pane|list|empty)-\d+$/.test(id);

    inputs.forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
        // Ignora inputs de arquivo e os campos dinâmicos da sub-aba de magias (para evitar colisão com _spells e _spellSlots)
        if (el.type !== 'file' && !isDetailSpellField(el.id) && !el.id.startsWith('slot-')) {
          data[el.id] = el.value;
        }
      }
    });

    console.log(`2. Coletados ${Object.keys(data).length} campos de texto e inputs básicos.`);

    const avatarImg = document.getElementById('char-avatar');
    const avatarSrc = (avatarImg && avatarImg.src && avatarImg.src.startsWith('data:image')) ? avatarImg.src : '';

    const finalData = {
      ...data,
      _profStates: typeof profStates !== 'undefined' ? profStates : {},
      _saveProfs: typeof saveProfs !== 'undefined' ? saveProfs : {},
      _inspiration: typeof inspiration !== 'undefined' ? inspiration : false,
      _deathSaves: typeof deathSaves !== 'undefined' ? deathSaves : { s: [false, false, false], f: [false, false, false] },
      _attacks: typeof attacks !== 'undefined' ? attacks : [],

      // DADOS MÁGICOS
      _spellSlots: window.spellSlots || {},
      _secondarySpellSlots: window.secondarySpellSlots || {},
      _spells: window.spells || {},
      _spellDCOverride: typeof spellDCOverride !== 'undefined' ? spellDCOverride : false,
      _spellAtkOverride: typeof spellAtkOverride !== 'undefined' ? spellAtkOverride : false,

      _theme: document.body.getAttribute('data-theme') || 'default',
      _avatar: avatarSrc,
      _limitedResources: typeof limitedResources !== 'undefined' ? limitedResources : [],
      _feats: typeof feats !== 'undefined' ? feats : [],
      _initiativeOverride: typeof initiativeOverride !== 'undefined' ? initiativeOverride : false,
      _passivePercOverride: typeof passivePercOverride !== 'undefined' ? passivePercOverride : false,
      _bgImage: window.imagemFundoCustomizada || '',
    };

    console.log('3. 🔮 STATUS DAS MAGIAS (Codex) A SALVAR:', JSON.parse(JSON.stringify(finalData._spells)));
    console.log('4. 💠 STATUS DOS SLOTS A SALVAR:', JSON.parse(JSON.stringify(finalData._spellSlots)));
    console.log('5. Dados finais prontos para injeção no HTML:', finalData);
    console.groupEnd();

    return finalData;
  }

  // Sobrescreve a função global para garantir que o html-generator use ESTA versão
  window.CharacterDataHelper = {
    collectData: collectData
  };

  /**
   * EXPORTAR: Cria arquivo HTML completo
   */
  const exportarHTML = () => {
    Logger.info('Iniciando exportação...');
    document.querySelectorAll('.rn-toggle').forEach(btn => {
      if (btn.textContent.trim() === '👁') btn.click();
    });
    HTMLGenerator.download();
  };

  /**
   * IMPORTAR: Carrega dados de arquivo HTML
   */
  const importarHTML = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      Logger.info(`Importando arquivo: ${file.name}`);
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const scriptData = doc.querySelector('#__dados_exportados__');
      if (!scriptData || !scriptData.textContent) {
        Toast.error('❌ Arquivo inválido ou sem dados');
        return false;
      }

      const data = JSON.parse(scriptData.textContent);

      if (!validarDadosImportados(data)) {
        Toast.error('❌ Dados corrompidos ou incompatíveis');
        return false;
      }

      await restaurarDados(data);
      Toast.success('📂 Ficha carregada com sucesso!');
      return true;

    } catch (err) {
      Logger.error('Erro ao importar HTML', err);
      Toast.error('❌ Erro ao ler o arquivo');
      return false;
    } finally {
      event.target.value = '';
    }
  };

  const validarDadosImportados = (data) => {
    if (!data || typeof data !== 'object') return false;
    const camposBasicos = ['char-name', 'char-level', 'char-class'];
    return camposBasicos.some(campo => campo in data) || data._theme;
  };

  /**
   * Restaura dados na ficha SEM quebrar
   */
  const restaurarDados = async (data) => {
    try {
      if (typeof window !== 'undefined') window.SHEET_DATA = data;

      // MUTAÇÃO DE REFERÊNCIA
      const mutarObjeto = (alvo, fonte) => {
        if (typeof alvo !== 'undefined' && alvo !== null && fonte) {
          Object.keys(alvo).forEach(k => delete alvo[k]);
          Object.assign(alvo, fonte);
        }
      };

      const mutarArray = (alvo, fonte) => {
        if (typeof alvo !== 'undefined' && alvo !== null && Array.isArray(fonte)) {
          alvo.length = 0;
          alvo.push(...fonte);
        }
      };

      mutarObjeto(typeof profStates !== 'undefined' ? profStates : null, data._profStates);
      mutarObjeto(typeof saveProfs !== 'undefined' ? saveProfs : null, data._saveProfs);
      mutarObjeto(typeof spellSlots !== 'undefined' ? spellSlots : null, data._spellSlots);
      mutarObjeto(typeof secondarySpellSlots !== 'undefined' ? secondarySpellSlots : null, data._secondarySpellSlots);
      mutarObjeto(typeof spells !== 'undefined' ? spells : null, data._spells);
      mutarObjeto(typeof deathSaves !== 'undefined' ? deathSaves : null, data._deathSaves);
      if (typeof invTabsData !== 'undefined' && data._invTabsData) invTabsData = data._invTabsData;

      mutarArray(typeof attacks !== 'undefined' ? attacks : null, data._attacks);
      mutarArray(typeof limitedResources !== 'undefined' ? limitedResources : null, data._limitedResources);
      mutarArray(typeof feats !== 'undefined' ? feats : null, data._feats);

      if (typeof passivePercOverride !== 'undefined') passivePercOverride = data._passivePercOverride || false;
      if (typeof inspiration !== 'undefined') inspiration = data._inspiration || false;

      // Reconstrói estruturas HTML
      const funcoes = [
        'buildAttrs', 'buildSaves', 'buildSkills', 'renderFeats',
        'buildSpells', 'buildSlotOverview', 'renderLimitedResources', 'renderAttacks'
      ];
      for (const func of funcoes) {
        if (typeof window[func] === 'function') {
          try { window[func](); } catch (err) { }
        }
      }

      // Preenche valores em todos os inputs/selects cadastrados
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('_') || key.startsWith('slot-')) return;
        const el = document.getElementById(key);
        if (el) {
          try {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
              el.value = value;
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          } catch (err) { }
        }
      });

      restaurarEstadosVisuais(data);

      const callbacks = ['onAttrChange', 'updateProfBonus', 'updateHeader', 'updateHPBar', 'updateSaves', 'updateSkills', 'updateSpellDC'];
      for (const cb of callbacks) {
        if (typeof window[cb] === 'function') {
          try { window[cb](); } catch (err) { }
        }
      }

      if (data._theme && typeof changeTheme === 'function') {
        changeTheme(data._theme);
        if (typeof window.updateThemeButtonUI === 'function') window.updateThemeButtonUI(data._theme);
      }

      if (data._avatar) {
        const img = document.getElementById('char-avatar');
        if (img) {
          img.src = data._avatar;
          img.style.display = 'block';
          const placeholder = document.getElementById('avatar-placeholder');
          if (placeholder) placeholder.style.display = 'none';
          const resetBtn = document.getElementById('avatar-reset-btn');
          if (resetBtn) resetBtn.style.display = 'block';
        }
      }

      if (typeof refreshSpellSystem === 'function') {
        refreshSpellSystem();
      }

    } catch (err) {
      Logger.error('Erro geral ao restaurar dados', err);
      throw err;
    }
  };

  const restaurarEstadosVisuais = (data) => {
    try {
      if (typeof ATTRS !== 'undefined' && data._saveProfs) {
        ATTRS.forEach(a => {
          const check = document.getElementById('save-check-' + a.id);
          if (check) check.className = 'save-check' + (data._saveProfs[a.id] ? ' active' : '');
        });
      }
      const insp = document.getElementById('insp-box');
      if (insp) insp.className = 'insp-box' + (data._inspiration ? ' active' : '');

      if (data._deathSaves) {
        ['s', 'f'].forEach(type => {
          const saves = data._deathSaves[type] || [false, false, false];
          saves.forEach((filled, i) => {
            const ds = document.getElementById(`ds-${type}${i + 1}`);
            if (ds) ds.classList.toggle('filled', filled);
          });
        });
      }
    } catch (err) { }
  };

  const importarPDF = async (input) => {
    if (!input.files[0]) return;

    try {
      if (typeof PDFLib === 'undefined') {
        Toast.error('❌ Erro: Bibliotecas de PDF não carregaram.');
        return false;
      }

      Logger.info('Importando PDF...');
      const arrayBuffer = await input.files[0].arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
      const pdfFields = {};

      form.getFields().forEach(field => {
        const name = field.getName().trim();
        try {
          if (typeof field.getText === 'function') {
            pdfFields[name] = field.getText() || '';
          } else if (typeof field.isChecked === 'function') {
            pdfFields[name] = field.isChecked() ? 'true' : '';
          } else if (typeof field.getSelected === 'function') {
            const escolhas = field.getSelected();
            pdfFields[name] = escolhas.length > 0 ? escolhas[0] : '';
          }
        } catch (e) { }
      });

      if (typeof PDFFieldMapping !== 'undefined') {
        PDFFieldMapping.applyFieldsToHTML(pdfFields);

        const bgValue = PDFFieldMapping.getFieldValue(pdfFields, ['Background', 'Antecedente', 'CharBackground']);
        if (bgValue) {
          const bgEl = document.getElementById('char-background') || document.getElementById('background');
          if (bgEl) {
            bgEl.value = bgValue;
            bgEl.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }

        const classValue = PDFFieldMapping.getFieldValue(pdfFields, ['ClassLevel', 'Class', 'Classe']);
        const armorProfsStr = PDFFieldMapping.applyArmorProficiencies(pdfFields, classValue);
        if (armorProfsStr) {
          const armorEl = document.getElementById('prof-armor');
          if (armorEl) armorEl.value = armorProfsStr;
        }

        const langTools = PDFFieldMapping.applyLanguagesAndTools(pdfFields);
        if (langTools.languages) {
          const langEl = document.getElementById('prof-langs');
          if (langEl) langEl.value = langTools.languages;
        }
      }

      const callbacks = ['onAttrChange', 'updateHPBar', 'updateHeader', 'updateSaves', 'updateSkills', 'renderAttacks', 'buildSpells', 'buildSlotOverview'];
      for (const cb of callbacks) {
        if (typeof window[cb] === 'function') {
          try { window[cb](); } catch (err) { }
        }
      }

      Toast.success('📄 PDF importado com sucesso!');
      return true;

    } catch (err) {
      Logger.error('Erro ao importar PDF', err);
      Toast.error('❌ Erro na importação do PDF');
      return false;
    } finally {
      input.value = '';
    }
  };

  const lidarComImportacao = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
      await importarPDF(event.target);
    } else if (fileName.endsWith('.html') || file.type === 'text/html') {
      await importarHTML(event);
    } else {
      Toast.error('❌ Formato não suportado (use PDF ou HTML)');
      event.target.value = '';
    }
  };

  return {
    exportarHTML,
    importarHTML,
    importarPDF,
    lidarComImportacao,
    collectData,
  };
})();

/**
 * Mapeia e migra campos legados (como antecedentes e alinhamento)
 */
const associarCamposAntigos = (data) => {
  // Mapeamento de Antecedente
  const bgVal = data['char-bg'] || data['char-background'] || data['background'] || data['antecedente'] || '';
  if (bgVal) {
    data['char-background'] = bgVal;
    data['char-bg'] = bgVal;
    data['background'] = bgVal;
  }

  // Mapeamento de Alinhamento
  const alignVal = data['char-align'] || data['char-alignment'] || data['align'] || data['alignment'] || data['alinhamento'] || '';
  if (alignVal) {
    data['char-align'] = alignVal;
    data['char-alignment'] = alignVal;
    data['align'] = alignVal;
  }
};
