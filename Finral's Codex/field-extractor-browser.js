/**
 * =========================================
 * FIELD-EXTRACTOR-BROWSER.JS
 * =========================================
 * 
 * Execute isto no console (F12) para ver
 * TODOS os campos reais dos PDFs.
 * 
 * COMO USAR:
 * 1. Abra console (F12)
 * 2. Cole este código
 * 3. Clique em "Importar PDF"
 * 4. Veja no console todos os 237+ campos!
 */

const FullFieldExtractor = (() => {
  const extractFromPDF = async (file) => {
    try {
      console.clear();
      console.log('📊 EXTRATINDO TODOS OS CAMPOS DO PDF...\n');

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      const allFields = [];
      const fieldsByType = {
        text: [],
        checkbox: [],
        radio: [],
        dropdown: [],
        unknown: []
      };

      // Extrair TODOS os campos
      form.getFields().forEach((field, index) => {
        const name = field.getName();
        let value = '';
        let type = 'unknown';

        try {
          // Detectar tipo
          if (typeof field.getText === 'function') {
            type = 'text';
            try {
              value = field.getText() || '';
            } catch (e) {
              try {
                value = field.acroField?.getV?.()?.toString?.() || '';
              } catch (e2) {}
            }
          } else if (typeof field.isChecked === 'function') {
            type = 'checkbox';
            value = field.isChecked() ? '✓' : '';
          } else if (typeof field.getSelected === 'function') {
            type = 'radio/dropdown';
            const selected = field.getSelected();
            value = selected.length > 0 ? selected.join(', ') : '';
          }

          const fieldData = {
            index: index + 1,
            name: name,
            type: type,
            value: value,
            isEmpty: !value,
            valueTrunc: String(value).substring(0, 80)
          };

          allFields.push(fieldData);

          // Categorizar
          if (type === 'text') fieldsByType.text.push(fieldData);
          else if (type === 'checkbox') fieldsByType.checkbox.push(fieldData);
          else if (type === 'radio/dropdown') fieldsByType.dropdown.push(fieldData);
          else fieldsByType.unknown.push(fieldData);

        } catch (e) {
          console.error(`Erro extraindo campo ${index}:`, e);
        }
      });

      // OUTPUT ESTRUTURADO
      console.log('='.repeat(120));
      console.log(`📊 ANÁLISE COMPLETA - ${file.name}`);
      console.log('='.repeat(120));

      console.log(`\n📈 RESUMO GERAL:`);
      console.log(`   Total de campos: ${allFields.length}`);
      console.log(`   ✅ Com valores: ${allFields.filter(f => !f.isEmpty).length}`);
      console.log(`   ⬜ Vazios: ${allFields.filter(f => f.isEmpty).length}`);
      console.log(`   📝 Texto: ${fieldsByType.text.length}`);
      console.log(`   ☑️  Checkbox: ${fieldsByType.checkbox.length}`);
      console.log(`   ◯ Radio/Dropdown: ${fieldsByType.dropdown.length}`);

      // CAMPOS COM VALORES
      const fieldsWithValues = allFields.filter(f => !f.isEmpty);
      
      console.log(`\n${'✅ CAMPOS COM VALORES'.padEnd(60)} (${fieldsWithValues.length}):`);
      console.log('-'.repeat(120));
      console.log('INDEX | TIPO         | NOME DO CAMPO'.padEnd(80) + ' | VALOR');
      console.log('-'.repeat(120));

      fieldsWithValues.forEach(f => {
        const typeIcon = {
          'text': '📝',
          'checkbox': '☑️ ',
          'radio/dropdown': '◯ ',
          'unknown': '❓'
        }[f.type] || '  ';

        console.log(
          `${String(f.index).padEnd(5)} | ` +
          `${(typeIcon + ' ' + f.type).padEnd(12)} | ` +
          `${f.name.padEnd(40)} | ` +
          `${f.valueTrunc}`
        );
      });

      // CAMPOS PARA MAPEAMENTO
      console.log(`\n\n💡 COPIAR PARA MAPEAMENTO (Cole em PDFFieldMapping.FIELD_MAP):`);
      console.log('-'.repeat(120));
      console.log('```javascript');

      const newMappings = {};
      fieldsWithValues.forEach(f => {
        const guessId = f.name.toLowerCase()
          .replace(/[^\w]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        if (!newMappings[guessId]) {
          newMappings[guessId] = [];
        }
        newMappings[guessId].push(f.name);
      });

      Object.entries(newMappings).forEach(([id, names]) => {
        console.log(`'${id}': [${names.map(n => `'${n}'`).join(', ')}],`);
      });

      console.log('```');

      // JSON COMPLETO
      console.log(`\n\n📋 JSON COMPLETO (para analysis):`);
      console.log('-'.repeat(120));
      console.log(JSON.stringify(allFields, null, 2));

      // Retornar dados
      return {
        fileName: file.name,
        totalFields: allFields.length,
        fieldsWithValues: fieldsWithValues.length,
        allFields: allFields,
        fieldsByType: fieldsByType,
        suggestedMappings: newMappings
      };

    } catch (err) {
      console.error('❌ ERRO:', err);
      throw err;
    }
  };

  // Auto-setup
  const setupListener = () => {
    document.addEventListener('change', async (e) => {
      if (e.target.type === 'file' && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          console.log(`🔄 Processando ${file.name}...`);
          
          // Aguardar PDFLib
          let attempts = 0;
          while (!window.PDFLib && attempts < 50) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }

          if (window.PDFLib) {
            const result = await extractFromPDF(file);
            console.log(`\n✅ Extração concluída!`);
            console.log(`Resultado armazenado em: window.lastPDFAnalysis`);
            window.lastPDFAnalysis = result;
          } else {
            console.error('❌ PDFLib não carregou');
          }
        }
      }
    });
  };

  return {
    extractFromPDF,
    setupListener
  };
})();

// Auto-inicializar
FullFieldExtractor.setupListener();
console.log('✅ Field Extractor pronto!');
console.log('📌 Clique em "Importar PDF" e veja todos os campos no console.');
console.log('💾 Resultado salvo em: window.lastPDFAnalysis');
