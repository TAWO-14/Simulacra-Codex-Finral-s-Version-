/**
 * =========================================
 * EXPORT-IMPORT.JS - Importação/Exportação de Fichas
 * =========================================
 * 
 * Versão refatorada:
 * ✅ Export leve (só dados, sem clone do DOM)
 * ✅ Import robusto com validação
 * ✅ Tratamento de libs faltando
 * ✅ Sem deixar ficha quebrada
 */

const ExportImportSystem = (() => {
  /**
   * Coletar dados da ficha (OTIMIZADO)
   * @returns {Object} Dados coletados
   */
  const collectData = () => {
    try {
      const data = {};

      // 1️⃣ Campos de formulário (rápido)
      const inputs = document.querySelectorAll('input[id], textarea[id], select[id]');
      inputs.forEach(el => {
        if (el.id && !el.id.startsWith('_')) {
          data[el.id] = el.value;
        }
      });

      // 2️⃣ Estados (rápido)
      if (typeof profStates !== 'undefined') data._profStates = profStates;
      if (typeof saveProfs !== 'undefined') data._saveProfs = saveProfs;
      if (typeof attacks !== 'undefined') data._attacks = attacks;
      if (typeof spellSlots !== 'undefined') data._spellSlots = spellSlots;
      if (typeof spells !== 'undefined') data._spells = spells;
      if (typeof limitedResources !== 'undefined') data._limitedResources = limitedResources;
      if (typeof feats !== 'undefined') data._feats = feats;
      if (typeof initiativeOverride !== 'undefined') data._initiativeOverride = initiativeOverride;
      if (typeof passivePercOverride !== 'undefined') data._passivePercOverride = passivePercOverride;
      if (typeof inspiration !== 'undefined') data._inspiration = inspiration;
      if (typeof deathSaves !== 'undefined') data._deathSaves = deathSaves;

      // 3️⃣ Tema e avatar (opcionais)
      const themeClass = Array.from(document.body.classList).find(c => c.startsWith('theme-'));
      if (themeClass) data._theme = themeClass;

      const avatarImg = document.getElementById('char-avatar');
      if (avatarImg && avatarImg.src && !avatarImg.src.includes('placeholder')) {
        data._avatar = avatarImg.src;
      }

      Logger.debug('Dados coletados com sucesso', { campos: inputs.length });
      return data;

    } catch (err) {
      Logger.error('Erro ao coletar dados', err);
      throw new Error('Falha ao coletar dados da ficha');
    }
  };

  /**
   * EXPORTAR: Cria arquivo HTML completo, funcional e independente
   */
  const exportarHTML = () => {
    Logger.info('Iniciando exportação...');
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
        Logger.warn('Arquivo não contém dados exportados válidos');
        return false;
      }

      const data = JSON.parse(scriptData.textContent);
      Logger.debug('Dados importados', { campos: Object.keys(data).length });

      // Validar dados
      if (!validarDadosImportados(data)) {
        Toast.error('❌ Dados corrompidos ou incompatíveis');
        return false;
      }

      // Restaurar dados (SEGURO - sem quebrar ficha)
      await restaurarDados(data);

      Toast.success('📂 Ficha carregada com sucesso!');
      Logger.info('Ficha restaurada completamente');
      return true;

    } catch (err) {
      Logger.error('Erro ao importar HTML', err);
      Toast.error('❌ Erro ao ler o arquivo');
      return false;
    } finally {
      event.target.value = '';
    }
  };

  /**
   * Valida dados antes de restaurar
   * @private
   */
  const validarDadosImportados = (data) => {
    if (!data || typeof data !== 'object') {
      Logger.warn('Dados não é um objeto');
      return false;
    }

    // Verificar se tem pelo menos alguns campos
    const camposBasicos = ['char-name', 'char-level', 'char-class'];
    const temCamposBasicos = camposBasicos.some(campo => campo in data);

    if (!temCamposBasicos && !data._theme) {
      Logger.warn('Arquivo não contém dados de ficha válidos');
      return false;
    }

    return true;
  };

  /**
   * Restaura dados na ficha SEM quebrar
   * @private
   */
  const restaurarDados = async (data) => {
    try {
      // 1️⃣ Restaurar variáveis globais PRIMEIRO (com fallback)
      if (typeof window !== 'undefined') {
        window.SHEET_DATA = data;

        profStates = data._profStates || {};
        saveProfs = data._saveProfs || {};
        attacks = data._attacks || [];
        spellSlots = data._spellSlots || {};
        spells = data._spells || {};
        limitedResources = data._limitedResources || [];
        feats = data._feats || [];
        initiativeOverride = data._initiativeOverride || false;
        passivePercOverride = data._passivePercOverride || false;
        inspiration = data._inspiration || false;
        deathSaves = data._deathSaves || { s: [false, false, false], f: [false, false, false] };
      }

      // 2️⃣ Reconstrói estruturas HTML (se existem funções)
      const funcoes = [
        'buildAttrs',
        'buildSaves',
        'buildSkills',
        'renderFeats',
        'buildSpells',
        'buildSlotOverview',
        'renderLimitedResources',
        'renderAttacks',
      ];

      for (const func of funcoes) {
        if (typeof window[func] === 'function') {
          try {
            window[func]();
            Logger.debug(`✓ ${func} executada`);
          } catch (err) {
            Logger.warn(`Erro ao executar ${func}`, err);
          }
        }
      }

      // 3️⃣ Preenche valores dos inputs
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('_')) return; // Skip internos

        const el = document.getElementById(key);
        if (el) {
          try {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
              el.value = value;
            }
          } catch (err) {
            Logger.debug(`Erro ao restaurar campo ${key}`, err);
          }
        }
      });

      // 4️⃣ Restaurar estados visuais
      restaurarEstadosVisuais(data);

      // 5️⃣ Recalcular tudo
      const callbacks = [
        'onAttrChange',
        'updateProfBonus',
        'updateHeader',
        'updateHPBar',
        'updateSaves',
        'updateSkills',
      ];

      for (const cb of callbacks) {
        if (typeof window[cb] === 'function') {
          try {
            window[cb]();
          } catch (err) {
            Logger.debug(`Erro ao chamar ${cb}`, err);
          }
        }
      }

      // 6️⃣ Restaurar tema
      if (data._theme && typeof changeTheme === 'function') {
        try {
          changeTheme(data._theme);
        } catch (err) {
          Logger.debug('Erro ao restaurar tema', err);
        }
      }

      // 7️⃣ Restaurar avatar
      if (data._avatar) {
        const img = document.getElementById('char-avatar');
        const placeholder = document.getElementById('avatar-placeholder');
        const resetBtn = document.getElementById('avatar-reset-btn');

        if (img) {
          img.src = data._avatar;
          img.style.display = 'block';
        }
        if (placeholder) placeholder.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'block';
      }

    } catch (err) {
      Logger.error('Erro geral ao restaurar dados', err);
      throw err;
    }
  };

  /**
   * Restaura estados visuais (checks, highlights, etc)
   * @private
   */
  const restaurarEstadosVisuais = (data) => {
    try {
      // Proficiências (saves)
      if (typeof ATTRS !== 'undefined' && data._saveProfs) {
        ATTRS.forEach(a => {
          const check = document.getElementById('save-check-' + a.id);
          if (check) {
            check.className = 'save-check' + (data._saveProfs[a.id] ? ' active' : '');
          }
        });
      }

      // Inspiration
      const insp = document.getElementById('insp-box');
      if (insp) {
        insp.className = 'insp-box' + (data._inspiration ? ' active' : '');
      }

      // Death saves
      if (data._deathSaves) {
        ['s', 'f'].forEach(type => {
          const saves = data._deathSaves[type] || [false, false, false];
          saves.forEach((filled, i) => {
            const ds = document.getElementById(`ds-${type}${i + 1}`);
            if (ds) ds.classList.toggle('filled', filled);
          });
        });
      }

      Logger.debug('Estados visuais restaurados');
    } catch (err) {
      Logger.debug('Erro ao restaurar estados visuais', err);
    }
  };

  /**
   * IMPORTAR PDF (com validação de libs)
   */
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

      // Extração de campos brutos do PDF (mantém igual você já tem)
      form.getFields().forEach(field => {
        const name = field.getName().trim();
        try {
          if (typeof field.getText === 'function') {
            let val = '';
            try { val = field.getText() || ''; }
            catch (errRich) {
              val = field.acroField && typeof field.acroField.getV === 'function' ? (field.acroField.getV() || '') : '';
            }
            pdfFields[name] = val;
          } else if (typeof field.isChecked === 'function') {
            pdfFields[name] = field.isChecked() ? 'true' : '';
          } else if (typeof field.getSelected === 'function') {
            const escolhas = field.getSelected();
            pdfFields[name] = escolhas.length > 0 ? escolhas[0] : '';
          } else {
            if (field.acroField && typeof field.acroField.getV === 'function') {
              const rawVal = field.acroField.getV();
              pdfFields[name] = rawVal ? rawVal.toString().replace(/^\//, '') : '';
            } else {
              pdfFields[name] = '';
            }
          }
        } catch (e) { }
      });

      Logger.info(`${Object.keys(pdfFields).length} campos extraídos do PDF`);

// ==========================================================
      // APLICA OS DADOS USANDO O MAPPESAMENTO INTELIGENTE
      // ==========================================================
      PDFFieldMapping.applyFieldsToHTML(pdfFields);

      // Trata campos extras (armaduras, idiomas, magias) se necessário:
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
      // ==========================================================

      // Dispara os callbacks visuais e de cálculo
      const callbacks = [
        'onAttrChange',
        'updateHPBar',
        'updateHeader',
        'updateSaves',
        'updateSkills',
        'renderAttacks',
        'buildSpells',
        'buildSlotOverview',
      ];

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

  /**
   * Aplica dados extraídos do PDF
   * @private
   */
  const aplicarDadosPDF = async (pdfFields, input) => {
    // Aqui vai sua lógica de mapeamento de campos PDF
    // (mantém igual ao seu código original - é complexa demais)

    // Placeholder:
    const getVal = (possibleNames) => {
      if (!Array.isArray(possibleNames)) possibleNames = [possibleNames];
      for (let name of possibleNames) {
        if (pdfFields[name] && pdfFields[name] !== 'Off') return pdfFields[name];
      }
      return '';
    };

    // Exemplo de aplicação
    const name = getVal(['Character Name', 'CharacterName', 'Nome do Personagem']);
    if (name) {
      const el = document.getElementById('char-name');
      if (el) el.value = name;
    }

    // Suas funções de callback (se existem)
    const callbacks = [
      'onAttrChange',
      'updateHPBar',
      'updateHeader',
      'updateSaves',
      'updateSkills',
      'renderAttacks',
      'buildSpells',
      'buildSlotOverview',
    ];

    for (const cb of callbacks) {
      if (typeof window[cb] === 'function') {
        try {
          window[cb]();
        } catch (err) {
          Logger.debug(`Erro ao chamar ${cb}`, err);
        }
      }
    }
  };

  /**
   * Manipulador de importação (dispatch)
   */
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
