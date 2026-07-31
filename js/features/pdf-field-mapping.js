/**
 * =========================================
 * PDF-FIELD-MAPPING.JS (VERSÃO FINAL - PT-BR)
 * =========================================
 */

const PDFFieldMapping = {
  FIELD_MAP: {
    'char-name': ['Nome do Personagem', 'Nome do Personagem, Página Inicial', 'Character Name', 'Name'],
    'player-name': ['Nome do Jogador', 'Player Name'],
    'char-class': ['Classe e Nível', 'Classe Conjuradora', 'ClassLevel', 'Class and Level', 'Class'],
    'char-race': ['Raça', 'Race'],
    'char-bg': ['Antecedente', 'Background'],
    'char-align': ['Alinhamento', 'Tendência', 'Alignment'],
    'char-xp': ['Pontos de Experiência', 'XP', 'Experience Points'],
    'char-level': ['Nível', 'Level'],
    'prof-bonus': ['Bônus de Proficiência', 'Proficiency Bonus', 'PB'],
    'inspiration': ['Inspiração', 'Inspiration'],
    'passive-perception': ['Percepção Passiva', 'Passive Perception', 'PassWis'],

    'class-features': [
      'Características & Traços',
      'Características e Traços Adicionais',
      'Características e Traços',
      'Features and Traits',
      'Class Features',
      'Feats',
      'Background Feature',
      'Racial Traits',
      'Additional Features & Traits'
    ],

    // Adicione o ID real do seu HTML na esquerda:
    'features-traits': [
      'Características & Traços',
      'Características e Traços Adicionais',
      'Features and Traits',
      'Additional Features & Traits',
      'Feats',
      'Background Feature',
      'Racial Traits'
    ],

    'attr-score-str': ['STR2', 'Força', 'STR', 'Strength', 'STR1'],
    'attr-score-dex': ['DEX2', 'Destreza', 'DEX', 'Dexterity', 'DEX1'],
    'attr-score-con': ['CON2', 'Constituição', 'CON', 'Constitution', 'CON1'],
    'attr-score-int': ['INT2', 'Inteligência', 'INT', 'Intelligence', 'INT1'],
    'attr-score-wis': ['WIS2', 'Sabedoria', 'WIS', 'Wisdom', 'WIS1'],
    'attr-score-cha': ['CHA2', 'Carisma', 'CHA', 'Charisma', 'CHA1'],

    'armor-class': ['Classe de Armadura', 'CA', 'Armor Class', 'AC', 'ArmorAC'],
    'initiative': ['Iniciativa', 'Initiative', 'Init'],
    'speed': ['Deslocamento', 'Speed', 'Spd'],
    'hp-max': ['Pontos de Vida Máximos', 'PV Máximos', 'HPMax', 'Max Hit Points'],
    'hp-current': ['Pontos de Vida Atuais', 'PV Atuais', 'HPCurrent', 'Current Hit Points'],
    'hp-temp': ['Pontos de Vida Temporários', 'PV Temporários', 'HPTemp', 'Temporary Hit Points'],
    'hd-die': ['Dado de Vida Atual', 'HD', 'Hit Dice', 'HD1', 'HD2', 'HDT1', 'HDT2'],
    'hd-total': ['Dado de Vida Máximo', 'HDTotal', 'Total Hit Dice', 'HDL1', 'HDL2'],

    'prof-armor': ['Armaduras', 'ArmorProficiencies'],
    'prof-weapons': ['Armas', 'WeaponProficiencies'],
    'prof-tools': ['Ferramentas', 'ToolProfs'],
    'prof-langs': ['Outras Proficiências & Idiomas', 'Idiomas', 'Línguas', 'Languages'],
    'prof-weapons': ['Armas', 'WeaponProficiencies', 'WeaponSimple', 'WeaponMartial'],
    'equipment': [
      'Equipamento', 'Tesouro', 'Equipment', 'Treasure 1',
      'AttunedItems1', 'AttunedItems2', 'AttunedItems3',
      'ArmorType', 'Ammo1'
    ],

    'trait-personality': ['Traços de Personalidade', 'PersonalityTraits', 'Personality Traits'],
    'trait-ideals': ['Ideals', 'Ideais'],
    'trait-bonds': ['Vínculos', 'Bonds'],
    'trait-quirks': ['Fraquezas', 'Defeitos', 'Flaws', 'Madness Flaws'],

    'app-age': ['Idade', 'Age'],
    'app-height': ['Altura', 'Height'],
    'app-weight': ['Peso', 'Weight'],
    'app-eyes': ['Olhos', 'Eyes'],
    'app-skin': ['Pele', 'Skin'],
    'app-hair': ['Cabelo', 'Cabelos', 'Hair'],

    'coin-cp': ['PC', 'CP', 'Copper'],
    'coin-sp': ['PP', 'SP', 'Silver'],
    'coin-ep': ['PE', 'EP', 'Electrum'],
    'coin-gp': ['PO', 'GP', 'Gold'],
    'coin-pp': ['PL', 'PP', 'Platinum'],
    'equipment': ['Equipamento', 'Tesouro', 'Equipment', 'Treasure 1'],

    'class-features': [
      'Características & Traços',
      'Características e Traços Adicionais',
      'Características e Traços',
      'Features and Traits',
      'Class Features',
      'Feats',
      'Background Feature',
      'Racial Traits'
    ],

    'char-history': [
      'História do Personagem',
      'Aliados e Organização',
      'Backstory',
      'Additional Features & Traits', // <-- Aqui está o texto da sua descrição
    ],
    'spell-class': ['Classe Conjuradora', 'SpellcastingClass'],
    'spell-ability': ['Atributo de Conjuração', 'SpellcastingAbility'],
    'spell-dc': ['CD para evitar suas magias', 'SpellSaveDC'],
    'spell-atk': ['Modificador de Ataque Mágico', 'SpellAttackBonus'],

    // Campos extras detectados no log:
    'vision': ['Vision'],
    'exhaustion': ['Exhaustion'],
    'madness': ['Madness']
  },

  SAVES_MAP: {
    'str': ['Check Salvaguarda Força', 'Salvaguarda Força', 'SavStrProf'],
    'dex': ['Check Salvaguarda Destreza', 'Salvaguarda Destreza', 'SavDexProf'],
    'con': ['Check Salvaguarda Constituição', 'Salvaguarda Constituição', 'SavConProf'],
    'int': ['Check Salvaguarda Inteligência', 'Salvaguarda Inteligência', 'SavIntProf'],
    'wis': ['Check Salvaguarda Sabedoria', 'Salvaguarda Sabedoria', 'SavWisProf'],
    'cha': ['Check Salvaguarda Carisma', 'Salvaguarda Carisma', 'SavChaProf']
  },

  SKILLS_MAP: {
    'acrobatics': ['Check Acrobacia', 'Acrobacia', 'SklAcrProf'],
    'animal': ['Check Lidar com Animais', 'Lidar com Animais', 'SklAniProf'],
    'arcana': ['Check Arcanismo', 'Arcanismo', 'SklArcProf'],
    'athletics': ['Check Atletismo', 'Atletismo', 'SklAthProf'],
    'deception': ['Check Enganação', 'Enganação', 'SklDecProf'],
    'history': ['Check História', 'História', 'SklHisProf'],
    'insight': ['Check Intuição', 'Intuição', 'SklInsProf'],
    'intimidation': ['Check Intimidação', 'Intimidação', 'SklIntProf'],
    'investigation': ['Check Investigação', 'Investigação', 'SklInvProf'],
    'medicine': ['Check Medicina', 'Medicina', 'SklMedProf'],
    'nature': ['Check Natureza', 'Natureza', 'SklNatProf'],
    'perception': ['Check Percepção', 'Percepção', 'SklPercProf'],
    'performance': ['Check Atuação', 'Atuação', 'SklPerfProf'],
    'persuasion': ['Check Persuasão', 'Persuasão', 'SklPersProf'],
    'religion': ['Check Religião', 'Religião', 'SklRelProf'],
    'sleight': ['Check Prestidigitação', 'Prestidigitação', 'SklSleProf'],
    'stealth': ['Check Furtividade', 'Furtividade', 'SklSteProf'],
    'survival': ['Check Sobrevivência', 'Sobrevivência', 'SklSurProf']

  },

  normalizePdfData(pdfFields) {
    const dict = {};
    if (!pdfFields) return dict;

    if (Array.isArray(pdfFields)) {
      for (const item of pdfFields) {
        if (item.name && item.value !== undefined && item.value !== '') {
          dict[item.name.trim()] = item.value;
        }
      }
    } else if (typeof pdfFields === 'object') {
      for (const [key, val] of Object.entries(pdfFields)) {
        if (val !== undefined && val !== '') {
          dict[key.trim()] = val;
        }
      }
    }
    return dict;
  },

  getFieldValue(dict, possibleNames) {
    if (!dict || !possibleNames) return '';
    if (!Array.isArray(possibleNames)) possibleNames = [possibleNames];

    for (const name of possibleNames) {
      if (!name) continue;
      const target = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');

      for (const [key, value] of Object.entries(dict)) {
        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Busca exata em vez de parcial
        if (normalizedKey === target && value !== undefined && value !== null && String(value).trim() !== 'Off') {
          return String(value).trim();
        }
      }
    }
    return '';
  },

  isChecked(value) {
    if (!value) return false;
    const v = String(value).trim().toLowerCase();
    // PDFs usam diversas marcações para Checkbox marcado
    return ['true', 'yes', 'sim', 'on', '1', 'checked', '✓', 'x', '/yes', '/on'].includes(v);
  },

  applyFieldsToHTML(pdfFields) {
    const dict = this.normalizePdfData(pdfFields);
    const applied = {};
    const failed = [];

    try {
      for (const [htmlId, aliases] of Object.entries(this.FIELD_MAP)) {
        try {
          const el = document.getElementById(htmlId);
          if (!el) continue;

          // TRATAMENTO PARA ARMAS DO SEGUNDO MODELO (Checkboxes para Texto)
          if (htmlId === 'prof-weapons') {
            const weapons = [];
            if (this.isChecked(this.getFieldValue(dict, ['WeaponSimple']))) weapons.push('Simples');
            if (this.isChecked(this.getFieldValue(dict, ['WeaponMartial']))) weapons.push('Marciais');

            // Tenta pegar o texto padrão primeiro, se não achar, usa os checkboxes
            const textValue = this.getFieldValue(dict, ['Armas', 'WeaponProficiencies']);
            if (textValue && textValue !== 'true') weapons.unshift(textValue);

            if (weapons.length > 0) {
              el.value = weapons.join(', ');
              el.dispatchEvent(new Event('input', { bubbles: true }));
              applied[htmlId] = el.value;
              continue;
            }
          }

          if (htmlId === 'class-features' || htmlId === 'char-history' || htmlId === 'equipment') {
            const blocos = [];

            for (const alias of aliases) {
              const val = this.getFieldValue(dict, [alias]);
              if (val) {
                const textoLimpo = val.replace(/\r\n/g, '\n').trim();

                const linhas = textoLimpo.split('\n');
                const linhasFormatadas = linhas.map(l => {
                  const linha = l.trim();
                  if (/^[-*#\d]/.test(linha) || linha.length === 0) {
                    return linha;
                  }
                  if (linha.length < 60 && !linha.endsWith('.')) {
                    return `- ${linha}`;
                  }
                  return linha;
                }).join('\n');

                blocos.push(`## ${alias}\n${linhasFormatadas}`);
              }
            }

            if (blocos.length > 0) {
              el.value = blocos.join('\n\n');
              el.dispatchEvent(new Event('input', { bubbles: true }));
              applied[htmlId] = 'Texto Combinado Markdown';
            }
            continue;
          }

          const value = this.getFieldValue(dict, aliases);
          if (value && value !== 'Off') {
            let finalValue = value;
            if (htmlId === 'hd-total') {
              finalValue = String(finalValue).split(/[dD]/)[0];
            }
            if (el.type === 'number') {
              finalValue = String(finalValue).replace(/\+/g, '').replace(/[^\d.-]/g, '').trim();
            }

            el.value = finalValue;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            applied[htmlId] = finalValue;
          }
        } catch (err) {
          failed.push(`${htmlId}: ${err.message}`);
        }
      }

      // 2. Testes de Resistência (Salvaguardas)
      for (const [attr, aliases] of Object.entries(this.SAVES_MAP)) {
        try {
          const val = this.getFieldValue(dict, aliases);
          const isProf = this.isChecked(val);
          const checkEl = document.getElementById(`save-check-${attr}`);
          if (checkEl && isProf !== checkEl.classList.contains('active')) {
            if (typeof toggleSaveProf === 'function') toggleSaveProf(attr);
            else checkEl.classList.toggle('active', isProf);
          }
        } catch (err) {
          failed.push(`save-${attr}: ${err.message}`);
        }
      }

      // 3. Perícias
      for (const [skillKey, aliases] of Object.entries(this.SKILLS_MAP)) {
        try {
          const val = this.getFieldValue(dict, aliases);
          const skillEl = document.getElementById(`skill-prof-${skillKey}`);
          if (skillEl && this.isChecked(val) && !skillEl.classList.contains('proficient')) {
            if (typeof cycleSkillProf === 'function') cycleSkillProf(skillKey);
            else skillEl.classList.add('proficient');
          }
        } catch (err) {
          failed.push(`skill-${skillKey}: ${err.message}`);
        }
      }


      // 4. Ataques
      try {
        if (typeof attacks !== 'undefined' && Array.isArray(attacks)) {
          for (let i = 1; i <= 3; i++) {
            const name = this.getFieldValue(dict, [`Nome do Ataque ${i}`, `Attack${i}Name`]);
            const dmg = this.getFieldValue(dict, [`Dano do Ataque ${i}`, `Attack${i}DmgType`]);
            const bonus = this.getFieldValue(dict, [`Bônus Ataque ${i}`, `Attack${i}Bonus`]);

            if (name) {
              const idx = i - 1;
              if (!attacks[idx]) {
                if (typeof addAttack === 'function') addAttack();
                else attacks[idx] = { name: '', bonus: '', damage: '' };
              }
              attacks[idx].name = name;
              if (dmg) attacks[idx].damage = dmg;
              if (bonus) attacks[idx].bonus = bonus;

              const row = document.querySelector(`#attacks-body tr:nth-child(${i})`);
              if (row) {
                const inputs = row.querySelectorAll('input');
                if (inputs[0]) inputs[0].value = name;
                if (inputs[1] && bonus) inputs[1].value = bonus;
                if (inputs[2] && dmg) inputs[2].value = dmg;
              }
            }
          }
        }
      } catch (err) {
        failed.push(`ataques: ${err.message}`);
      }

// 5. Codex de Magias
      try {
        const catalogEl = document.getElementById('spells-catalog');
        if (catalogEl) {
          const spellsText = [];
          const cantrips = [];

          for (let i = 1; i <= 8; i++) {
            const c = this.getFieldValue(dict, [`Truque ${i}`, `Cantrip ${i}`, `SpellName0${i}`, `Spells 10${13 + i}`]);
            if (c) cantrips.push(`- ${c}`);
          }
          if (cantrips.length > 0) spellsText.push(`## Truques\n${cantrips.join('\n')}`);

          for (let level = 1; level <= 9; level++) {
            const levelSpells = [];
            for (let i = 1; i <= 15; i++) {
              const s = this.getFieldValue(dict, [
                `${level}º Círculo ${i}`, 
                `Magia ${level}º Círculo ${i}`,
                `Spell ${level}-${i}`,
                `SpellName${level}${i}`,
                `Spells ${level}0${i}`,
                `Spell ${level} ${i}`
              ]);
              if (s && !this.isChecked(s)) levelSpells.push(`- ${s}`);
            }
            if (levelSpells.length > 0) spellsText.push(`\n## Nível ${level}\n${levelSpells.join('\n')}`);
          }

          if (spellsText.length > 0) {
            catalogEl.value = spellsText.join('\n\n');
            catalogEl.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      } catch (err) {
        failed.push(`spells: ${err.message}`);
      }

      // 6. Slots de Magia e Interface Visual dos Losangos (Unificado)
      try {
        const spellSlots = this.extractSpellSlots(pdfFields);
        for (let level = 1; level <= 9; level++) {
          const data = spellSlots[level];
          if (data && data.total > 0) {
            // Tenta usar a API nativa da sua ficha primeiro
            if (typeof setSpellSlots === 'function') {
              setSpellSlots(level, data.total, data.used);
            } else if (typeof addSpellSlot === 'function') {
              for (let s = 0; s < data.total; s++) {
                addSpellSlot(level);
              }
            } else {
              // Fallback: preenche inputs genéricos de slots, caso existam na estrutura
              const totalInput = document.getElementById(`slots-total-${level}`) || document.getElementById(`spell-slots-total-${level}`);
              const usedInput = document.getElementById(`spell-slots-used-${level}`);
              if (totalInput) {
                totalInput.value = data.total;
                totalInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
              if (usedInput) {
                usedInput.value = data.used;
                usedInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }

            // Garante que as classes visuais ('used' vs 'avail') sejam aplicadas nos losangos (.sl-pip)
            const pipContainer = document.querySelector(`#slots-grid .slot-block:nth-child(${level}) .sl-pips`);
            if (pipContainer) {
              const pips = pipContainer.querySelectorAll('.sl-pip');
              pips.forEach((pip, index) => {
                if (index < data.used) {
                  pip.classList.add('used');
                  pip.classList.remove('avail');
                } else {
                  pip.classList.add('avail');
                  pip.classList.remove('used');
                }
              });
            }
            applied[`spell-slots-${level}`] = `${data.used}/${data.total}`;
          }
        }
      } catch (err) {
        failed.push(`spell-slots: ${err.message}`);
      }

      // 7. Atualização final de Cálculos e Dependências na Tela
      if (typeof onAttrChange === 'function') onAttrChange();
      if (typeof updateProfBonus === 'function') updateProfBonus();

      if (typeof Logger !== 'undefined') {
        Logger.debug(`${Object.keys(applied).length} campos aplicados com sucesso!`);
        if (failed.length > 0) Logger.debug(`Falhas: ${failed.slice(0, 5).join(', ')}`);
      }

      return applied;
    } catch (err) {
      if (typeof Logger !== 'undefined') Logger.error('Erro ao aplicar campos do PDF', err);
      return {};
    }
  },

  applyArmorProficiencies(pdfFields) {
    const dict = this.normalizePdfData(pdfFields);
    const armorProfs = [];
    try {
      if (this.isChecked(this.getFieldValue(dict, ['ArmorLight', 'Leve', 'Light Armor']))) armorProfs.push('Leves');
      if (this.isChecked(this.getFieldValue(dict, ['ArmorMedium', 'Média', 'Medium Armor']))) armorProfs.push('Médias');
      if (this.isChecked(this.getFieldValue(dict, ['ArmorHeavy', 'Pesada', 'Heavy Armor']))) armorProfs.push('Pesadas');
      if (this.isChecked(this.getFieldValue(dict, ['ArmorShields', 'Escudos', 'Shields']))) armorProfs.push('Escudos');
    } catch (err) { }
    return armorProfs.join(', ');
  },

  applyLanguagesAndTools(pdfFields) {
    const dict = this.normalizePdfData(pdfFields);
    try {
      const blocoProf = this.getFieldValue(dict, ['Outras Proficiências & Idiomas', 'Proficiências e Idiomas', 'ProficienciesLang']);
      const langs = this.getFieldValue(dict, ['Idiomas', 'Languages']) || blocoProf;
      const tools = this.getFieldValue(dict, ['Ferramentas', 'ToolProfs', 'Tools']);

      return {
        languages: langs ? String(langs).replace(/[\r\n]+/g, ' | ').trim() : '',
        tools: tools ? String(tools).replace(/[\r\n]+/g, ' | ').trim() : '',
      };
    } catch (err) {
      return { languages: '', tools: '' };
    }
  },

  extractSpellSlots(pdfFields) {
    const dict = this.normalizePdfData(pdfFields);
    if (typeof Logger !== 'undefined') {
      Logger.debug('Campos encontrados no PDF:', Object.keys(dict).join(' | '));
    }
    const spellSlots = {};
    try {
      for (let i = 1; i <= 9; i++) {
        // Lê exatamente os nomes que apareceram no seu console:
        const totalPDF = this.getFieldValue(dict, [`Total de Espaços Nv. ${i}`, `SpellSlotsTotal ${i}`]);
        const usedPDF = this.getFieldValue(dict, [`Espaços Utilizados Nv. ${i}`, `SpellSlotsUsed ${i}`]);

        spellSlots[i] = {
          total: totalPDF ? parseInt(String(totalPDF).replace(/[^\d]/g, '')) || 0 : 0,
          used: usedPDF ? parseInt(String(usedPDF).replace(/[^\d]/g, '')) || 0 : 0
        };
      }
    } catch (err) { }
    return spellSlots;
  }
};

window.onInitiativeInput = window.onInitiativeInput || function () { };