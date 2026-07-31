/**
 * =========================================
 * PDF-FIELD-DETECTOR.JS - Detector de Campos Ignorados
 * =========================================
 * 
 * Mostra EXATAMENTE quais dos 237 campos
 * estão sendo ignorados e por quê.
 */

const PDFFieldDetector = (() => {
  /**
   * Analisa e mostra todos os 237+ campos
   */
  const analyzeAllFields = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      const allFields = [];
      const mapped = [];
      const unmapped = [];
      const ignored = [];

      form.getFields().forEach(field => {
        const name = field.getName().trim();
        let value = '';

        try {
          if (typeof field.getText === 'function') {
            value = field.getText() || '';
          } else if (typeof field.isChecked === 'function') {
            value = field.isChecked() ? 'CHECKED' : '';
          } else if (typeof field.getSelected === 'function') {
            const sel = field.getSelected();
            value = sel.length > 0 ? sel[0] : '';
          }
        } catch (e) {}

        allFields.push({ name, value });

        // Verificar se está mapeado
        let isMapped = false;
        for (const [htmlId, aliases] of Object.entries(PDFFieldMapping.FIELD_MAP || {})) {
          for (const alias of aliases) {
            if (name === alias || name.toLowerCase() === String(alias).toLowerCase()) {
              isMapped = true;
              mapped.push({ htmlId, pdfName: name, value });
              break;
            }
          }
          if (isMapped) break;
        }

        if (!isMapped) {
          if (value) {
            unmapped.push({ name, value });
          } else {
            ignored.push({ name, reason: 'Vazio' });
          }
        }
      });

      // Output formatado
      console.clear();
      console.log('='.repeat(100));
      console.log('📊 ANÁLISE DETALHADA DE CAMPOS PDF');
      console.log('='.repeat(100));

      console.log(`\n📈 RESUMO:`);
      console.log(`   Total de campos no PDF: ${allFields.length}`);
      console.log(`   ✅ Mapeados e com valor: ${mapped.length}`);
      console.log(`   ❌ Não mapeados mas com valor: ${unmapped.length}`);
      console.log(`   ⬜ Vazios/Ignorados: ${ignored.length}`);

      // Campos mapeados
      console.log(`\n✅ CAMPOS MAPEADOS (${mapped.length}):`);
      console.log('-'.repeat(100));
      mapped.forEach(({ htmlId, pdfName, value }) => {
        console.log(`  ${htmlId.padEnd(25)} ← ${pdfName.padEnd(35)} = "${value}"`);
      });

      // Campos NÃO mapeados MAS COM VALOR
      console.log(`\n❌ CAMPOS NÃO MAPEADOS COM VALOR (${unmapped.length}):`);
      console.log('-'.repeat(100));
      unmapped.forEach(({ name, value }) => {
        console.log(`  "${name.padEnd(40)}" = "${String(value).substring(0, 50)}"`);
      });

      // Campos vazios
      console.log(`\n⬜ CAMPOS VAZIOS/IGNORADOS (${ignored.length}):`);
      console.log('-'.repeat(100));
      ignored.slice(0, 20).forEach(({ name }) => {
        console.log(`  "${name}"`);
      });
      if (ignored.length > 20) {
        console.log(`  ... e mais ${ignored.length - 20} campos vazios`);
      }

      // Sugestões para adicionar
      console.log(`\n💡 CAMPOS PARA ADICIONAR AO MAPEAMENTO:`);
      console.log('-'.repeat(100));
      console.log('```javascript');
      console.log("// Adicione isto ao PDFFieldMapping.FIELD_MAP:");
      unmapped.slice(0, 15).forEach(({ name }) => {
        const guessId = name.toLowerCase()
          .replace(/[^\w]/g, '-')
          .replace(/-+/g, '-');
        console.log(`'${guessId}': ['${name}'],`);
      });
      console.log('```');

      return {
        total: allFields.length,
        mapped: mapped.length,
        unmapped: unmapped.length,
        ignored: ignored.length,
        mappedFields: mapped,
        unmappedFields: unmapped,
        ignoredFields: ignored,
      };

    } catch (err) {
      console.error('Erro ao analisar PDF:', err);
      throw err;
    }
  };

  /**
   * Setup listener automático
   */
  const autoSetup = () => {
    document.addEventListener('change', async (e) => {
      if (e.target.type === 'file' && e.target.files[0]?.type === 'application/pdf') {
        console.log('🔍 Analisando PDF... Aguarde!');
        const analysis = await analyzeAllFields(e.target.files[0]);
        console.log('\n✅ Análise concluída!');
        console.log(`Resumo: ${analysis.mapped} mapeados, ${analysis.unmapped} não-mapeados, ${analysis.ignored} vazios`);
      }
    });
  };

  return {
    analyzeAllFields,
    autoSetup,
  };
})();

// Auto-inicializar
PDFFieldDetector.autoSetup();
console.log('📌 PDFFieldDetector pronto! Importe um PDF para ver análise detalhada.');
