/**
 * =========================================
 * PDF-AUTO-MAPPER.JS - Mapeamento Automático de PDFs
 * =========================================
 * 
 * Detecta automaticamente os campos de um PDF
 * e tenta mapear para a ficha D&D.
 * 
 * USO:
 * 1. Coloque este arquivo ANTES de export-import.js
 * 2. Ao importar PDF, logs mostram mapeamento
 * 3. Campos desconhecidos aparecem no console
 */

const PDFAutoMapper = (() => {
  /**
   * Mapeamento inteligente com regex fuzzy
   */
  const SMART_MAPPING = {
    // Informações básicas
    'char-name': [
      /character.?name/i,
      /nome.?personagem/i,
      /player.?name/i,
      /^name$/i,
      /personagem/i,
    ],
    'char-class': [
      /class.?level/i,
      /classe.?nível/i,
      /^class$/i,
      /classe/i,
    ],
    'char-race': [
      /race/i,
      /raça/i,
    ],
    'char-bg': [
      /background/i,
      /antecedente/i,
      /background/i,
    ],
    'char-align': [
      /alignment/i,
      /alinhamento/i,
      /tendência/i,
    ],
    'char-level': [
      /^level$/i,
      /^nível$/i,
    ],
    'char-xp': [
      /experience/i,
      /experiência/i,
      /xp/i,
    ],

    // Atributos
    'attr-score-str': [
      /^str$/i,
      /^str1$/i,
      /^str2$/i,
      /strength/i,
      /força/i,
    ],
    'attr-score-dex': [
      /^dex$/i,
      /^dex1$/i,
      /^dex2$/i,
      /dexterity/i,
      /destreza/i,
    ],
    'attr-score-con': [
      /^con$/i,
      /^con1$/i,
      /^con2$/i,
      /constitution/i,
      /constituição/i,
    ],
    'attr-score-int': [
      /^int$/i,
      /^int1$/i,
      /^int2$/i,
      /intelligence/i,
      /inteligência/i,
    ],
    'attr-score-wis': [
      /^wis$/i,
      /^wis1$/i,
      /^wis2$/i,
      /wisdom/i,
      /sabedoria/i,
    ],
    'attr-score-cha': [
      /^cha$/i,
      /^cha1$/i,
      /^cha2$/i,
      /charisma/i,
      /carisma/i,
    ],

    // Vital stats
    'armor-class': [
      /armor.?class/i,
      /classe.?armadura/i,
      /^ac$/i,
      /^ca$/i,
    ],
    'initiative': [
      /initiative/i,
      /iniciativa/i,
      /init/i,
    ],
    'speed': [
      /speed/i,
      /deslocamento/i,
    ],
    'hp-max': [
      /hp.?max/i,
      /max.?hp/i,
      /hit.?point.?max/i,
      /pv.?máx/i,
      /pontos.?vida.?máx/i,
    ],
    'hp-current': [
      /hp.?current/i,
      /current.?hp/i,
      /pv.?atual/i,
      /pontos.?vida.?atual/i,
    ],
    'hp-temp': [
      /hp.?temp/i,
      /temp.?hp/i,
      /pv.?temp/i,
    ],

    // Traits
    'trait-personality': [
      /personality/i,
      /traços/i,
      /personalidade/i,
    ],
    'trait-ideals': [
      /ideals/i,
      /ideais/i,
    ],
    'trait-bonds': [
      /bonds/i,
      /vínculos/i,
      /laços/i,
    ],
    'trait-quirks': [
      /flaws/i,
      /fraquezas/i,
      /defeitos/i,
    ],

    // Aparência
    'app-age': [/age/i, /idade/i],
    'app-height': [/height/i, /altura/i],
    'app-weight': [/weight/i, /peso/i],
    'app-eyes': [/eyes/i, /olhos/i],
    'app-skin': [/skin/i, /pele/i],
    'app-hair': [/hair/i, /cabelo/i],

    // Moedas
    'coin-cp': [/cp/i],
    'coin-sp': [/sp/i, /pp/i],
    'coin-gp': [/gp/i, /po/i],
    'coin-pp': [/^pp$/i, /pl/i],

    // Outros
    'char-history': [
      /backstory/i,
      /história/i,
      /history/i,
    ],
  };

  /**
   * Tenta mapear nome de campo PDF para campo da ficha
   * @param {string} pdfFieldName - Nome do campo no PDF
   * @returns {string|null} ID do campo HTML ou null
   */
  const mapField = (pdfFieldName) => {
    if (!pdfFieldName) return null;

    // Procura em todos os mapeamentos
    for (const [htmlId, patterns] of Object.entries(SMART_MAPPING)) {
      for (const pattern of patterns) {
        if (pattern.test(pdfFieldName)) {
          return htmlId;
        }
      }
    }

    return null; // Não mapeado
  };

  /**
   * Extrai e mapeia todos os campos de um PDF
   * @param {PDFDocument} pdfDoc - Documento PDF carregado
   * @returns {Object} { mapped: {...}, unmapped: {...}, stats: {...} }
   */
  const analyzeAndMap = (pdfDoc) => {
    const form = pdfDoc.getForm();
    const mapped = {};
    const unmapped = {};
    const stats = {
      total: 0,
      mapped: 0,
      unmapped: 0,
      empty: 0,
    };

    form.getFields().forEach(field => {
      const pdfName = field.getName();
      stats.total++;

      // Extrair valor
      let value = '';
      try {
        if (typeof field.getText === 'function') {
          value = field.getText() || '';
        } else if (typeof field.isChecked === 'function') {
          value = field.isChecked() ? 'true' : '';
        } else if (typeof field.getSelected === 'function') {
          const sel = field.getSelected();
          value = sel.length > 0 ? sel[0] : '';
        } else {
          value = field.acroField?.getV?.()?.toString?.() || '';
        }
      } catch (e) {}

      if (!value) stats.empty++;

      // Tentar mapear
      const htmlId = mapField(pdfName);

      if (htmlId) {
        mapped[htmlId] = value;
        stats.mapped++;
      } else {
        unmapped[pdfName] = value;
        stats.unmapped++;
      }
    });

    return { mapped, unmapped, stats };
  };

  /**
   * Aplica mapeamento aos campos HTML
   */
  const applyMapping = (mapping) => {
    const applied = {};
    const failed = {};

    for (const [htmlId, value] of Object.entries(mapping)) {
      if (!value) continue;

      const el = document.getElementById(htmlId);
      if (el) {
        try {
          el.value = value;
          applied[htmlId] = value;
        } catch (err) {
          failed[htmlId] = `Erro ao aplicar: ${err.message}`;
        }
      } else {
        failed[htmlId] = 'Elemento não encontrado no DOM';
      }
    }

    return { applied, failed };
  };

  /**
   * Log formatado no console
   */
  const logResults = (analysis) => {
    console.clear();
    console.log('='.repeat(80));
    console.log('📊 ANÁLISE DE MAPEAMENTO PDF');
    console.log('='.repeat(80));

    const { mapped, unmapped, stats } = analysis;

    console.log(`\n📈 ESTATÍSTICAS:`);
    console.log(`   Total de campos: ${stats.total}`);
    console.log(`   ✅ Mapeados: ${stats.mapped} (${Math.round(stats.mapped / stats.total * 100)}%)`);
    console.log(`   ❌ Não mapeados: ${stats.unmapped} (${Math.round(stats.unmapped / stats.total * 100)}%)`);
    console.log(`   ⬜ Vazios: ${stats.empty}`);

    console.log(`\n✅ CAMPOS MAPEADOS (${Object.keys(mapped).length}):`);
    console.log('-'.repeat(80));
    Object.entries(mapped)
      .filter(([, v]) => v)
      .forEach(([id, val]) => {
        console.log(`  ${id.padEnd(20)} = "${val}"`);
      });

    console.log(`\n❌ CAMPOS NÃO MAPEADOS (${Object.keys(unmapped).length}):`);
    console.log('-'.repeat(80));
    Object.entries(unmapped)
      .filter(([, v]) => v)
      .forEach(([name, val]) => {
        console.log(`  "${name}" = "${val}"`);
      });

    // Sugestões
    console.log(`\n💡 CAMPOS NÃO MAPEADOS PARA ADICIONAR AO MAPEAMENTO:`);
    console.log('-'.repeat(80));
    const suggestions = {};
    Object.entries(unmapped)
      .filter(([, v]) => v)
      .forEach(([name]) => {
        const guess = name.toLowerCase().match(/\w+/)?.[0] || name;
        suggestions[`'${guess}': ['${name}']`] = true;
      });
    Object.keys(suggestions).forEach(s => console.log(`  ${s},`));

    // Retornar dados para debug
    return { mapped, unmapped, stats };
  };

  return {
    mapField,
    analyzeAndMap,
    applyMapping,
    logResults,
    SMART_MAPPING,
  };
})();
