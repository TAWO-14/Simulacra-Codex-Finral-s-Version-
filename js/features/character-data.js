/* ==========================================================================
   CHARACTER DATA & CORE SYSTEM
   Gerencia atributos, resistências, perícias e o boot inicial da ficha.
   ========================================================================== */

window.SHEET_DATA = {};
let profStates = {};
let saveProfs = {};
let inspiration = false;
let deathSaves = { s: [false, false, false], f: [false, false, false] };
let attacks = [];
window.spellSlots = {};
window.spells = {};
window.secondarySpellSlots = {};
let limitedResources = [];
let passivePercOverride = false;
let spellDCOverride = false;
let spellAtkOverride = false;
window.imagemFundoCustomizada = window.imagemFundoCustomizada || '';

// ── Utilitários Base ──
function getMod(score) { return Math.floor((score - 10) / 2); }
function fmtMod(n) { return (n >= 0 ? '+' : '') + n; }

function getAttrVal(id) { return parseInt(document.getElementById('attr-score-' + id)?.value) || 10; }

function escapeHTML(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Construtores Base ──
function buildAttrs() {
    const grid = document.getElementById('attrs-grid');
    if (!grid) return;
    grid.innerHTML = '';
    ATTRS.forEach(a => {
        const div = document.createElement('div');
        div.className = 'attr-box';
        div.innerHTML = `
          <div class="attr-name">${a.name}</div>
          <input type="number" class="attr-score" id="attr-score-${a.id}" value="10" min="1" max="30" oninput="onAttrChange()">
          <div class="attr-mod" id="attr-mod-${a.id}">+0</div>
        `;
        grid.appendChild(div);
    });
}

function buildSaves() {
    const list = document.getElementById('saves-list');
    if (!list) return;
    list.innerHTML = '';
    ATTRS.forEach(a => {
        const row = document.createElement('div');
        row.className = 'save-row';
        row.innerHTML = `<div class="save-check" id="save-check-${a.id}" onclick="toggleSaveProf('${a.id}')"></div><div class="save-value" id="save-val-${a.id}">+0</div><div class="save-label">${a.name} <span style="font-size:10px; color:var(--text3);">(${ATTR_NAMES[a.id]})</span></div>`;
        list.appendChild(row);
    });
}

function buildSkills() {
    const list = document.getElementById('skills-list');
    if (!list) return;
    list.innerHTML = '';
    SKILLS_DEF.forEach(s => {
        const row = document.createElement('div');
        row.className = 'skill-row';
        row.innerHTML = `<div class="skill-prof" id="skill-prof-${s.id}" onclick="cycleSkillProf('${s.id}')"></div><div class="skill-val" id="skill-val-${s.id}">+0</div><div class="skill-name">${s.name}</div><div class="skill-attr">${ATTR_NAMES[s.attr]}</div>`;
        list.appendChild(row);
    });
}

// ── Atualizadores (Updaters) ──
function onPassivePercInput(el) {
    if (!el) return;
    let parsed = parseInt(el.value);
    if (isNaN(parsed)) {
        passivePercOverride = false;
        updateSkills();
    } else {
        passivePercOverride = true;
        el.value = parsed;
    }
}

function onAttrChange() {
    ATTRS.forEach(a => {
        const el = document.getElementById('attr-mod-' + a.id);
        if (el) el.textContent = fmtMod(getMod(getAttrVal(a.id)));
    });
    updateSaves();
    updateSkills();
    if (typeof updateSpellDC === 'function') updateSpellDC();
}

function updateSaves() {
    const pb = getProfBonus();
    ATTRS.forEach(a => {
        const val = getMod(getAttrVal(a.id)) + ((saveProfs[a.id] || false) ? pb : 0);
        const el = document.getElementById('save-val-' + a.id);
        if (el) el.textContent = fmtMod(val);
    });
}

function updateSkills() {
    const pb = getProfBonus();
    SKILLS_DEF.forEach(s => {
        const prof = profStates[s.id] || 0;
        const bonus = prof === 2 ? pb * 2 : prof === 1 ? pb : 0;
        const el = document.getElementById('skill-val-' + s.id);
        if (el) el.textContent = fmtMod(getMod(getAttrVal(s.attr)) + bonus);
        const pd = document.getElementById('skill-prof-' + s.id);
        if (pd) pd.className = 'skill-prof' + (prof === 1 ? ' prof' : prof === 2 ? ' expert' : '');
    });

    const ppEl = document.getElementById('passive-perc');
    if (ppEl) {
        const obsCheck = document.getElementById('obs-check');
        const obsBonus = (obsCheck && obsCheck.classList.contains('active')) ? 5 : 0;

        if (!passivePercOverride || ppEl.value === '') {
            const percProf = profStates['perception'] || 0;
            const percBonus = percProf === 2 ? pb * 2 : percProf === 1 ? pb : 0;
            ppEl.value = 10 + getMod(getAttrVal('wis')) + percBonus + obsBonus;
        }
    }
}

function onLevelChange() {
    updateProfBonus();
}

// Handler seguro para digitação no campo de Nível
function onLevelInput(el) {
    if (!el) return;
    let val = parseInt(el.value, 10);

    // Evita valores fora do intervalo (1 a 20) durante a digitação.
    // Só corrige quando o valor já é um número completo e fora da faixa;
    // nunca mexe no campo enquanto ele está vazio (usuário apagando para redigitar).
    if (!isNaN(val)) {
        if (val > 20) el.value = 20;
        if (val < 1) el.value = 1;
    }

    // Atualiza o Bônus de Proficiência e recálculos dependentes
    updateProfBonus();
}

// Garante leitura segura do Nível (funciona mesmo se o elemento ainda
// não existir no DOM no momento da chamada)
function getProfBonus() {
    const lvlInput = document.getElementById('char-level');
    const parsed = lvlInput ? parseInt(lvlInput.value, 10) : 1;
    const level = isNaN(parsed) || parsed < 1 ? 1 : (parsed > 20 ? 20 : parsed);
    return Math.ceil(level / 4) + 1;
}

// Ponto único de atualização do bônus de proficiência e de tudo que
// depende dele. Cada etapa roda isolada em try/catch: se qualquer
// cálculo dependente falhar (perícias, magia, etc.), o número do
// bônus em si NUNCA fica desatualizado por causa disso.
function updateProfBonus() {
    const pbValue = fmtMod(getProfBonus());

    const el = document.getElementById('prof-bonus');
    if (el) el.textContent = pbValue;

    try { updateSaves(); } catch (e) { console.error('Erro ao atualizar resistências:', e); }
    try { updateSkills(); } catch (e) { console.error('Erro ao atualizar perícias:', e); }
    try {
        if (typeof updateSpellDC === 'function') updateSpellDC();
    } catch (e) { console.error('Erro ao atualizar CD de magia:', e); }
}

function toggleSaveProf(id) {
    saveProfs[id] = !saveProfs[id];
    document.getElementById('save-check-' + id).className = 'save-check' + (saveProfs[id] ? ' active' : '');
    updateSaves();
}

function cycleSkillProf(id) {
    profStates[id] = ((profStates[id] || 0) + 1) % 3;
    updateSkills();
}

function updateHeader() {
    const nameEl = document.getElementById('header-name');
    if (nameEl) nameEl.textContent = document.getElementById('char-name')?.value || 'Nome do Personagem';
    const sub = document.getElementById('header-subtitle');
    if (sub && !sub.value) {
        sub.placeholder = [document.getElementById('char-class')?.value, document.getElementById('char-race')?.value, document.getElementById('char-align')?.value].filter(Boolean).join(' · ') || 'Classe · Raça · Alinhamento';
    }
}

// ── Coleta de Dados da Ficha Inteira ──
function collectData() {
    const data = {};
    document.querySelectorAll('[id]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
            if (el.type !== 'file' && !el.id.startsWith('spell-') && !el.id.startsWith('slot-')) {
                data[el.id] = el.value;
            }
        }
    });

    // Força explicitamente a coleta correta do nível do personagem
    const lvlEl = document.getElementById('char-level');
    if (lvlEl) {
        data['char-level'] = lvlEl.value || '1';
    }

    const avatarImg = document.getElementById('char-avatar');
    const avatarSrc = (avatarImg && avatarImg.src && avatarImg.src.startsWith('data:image')) ? avatarImg.src : '';
    return {
        ...data,
        _profStates: profStates,
        _saveProfs: saveProfs,
        _inspiration: typeof inspiration !== 'undefined' ? inspiration : false,
        _deathSaves: typeof deathSaves !== 'undefined' ? deathSaves : { s: [false, false, false], f: [false, false, false] },
        _attacks: typeof attacks !== 'undefined' ? attacks : [],
        _spellSlots: typeof spellSlots !== 'undefined' ? spellSlots : {},
        _secondarySpellSlots: typeof secondarySpellSlots !== 'undefined' ? secondarySpellSlots : {},
        _spells: typeof spells !== 'undefined' ? spells : {},
        _theme: document.body.getAttribute('data-theme') || 'default',
        _avatar: avatarSrc,
        _limitedResources: typeof limitedResources !== 'undefined' ? limitedResources : [],
        _feats: typeof feats !== 'undefined' ? feats : [],
        _initiativeOverride: typeof initiativeOverride !== 'undefined' ? initiativeOverride : false,
        _passivePercOverride: typeof passivePercOverride !== 'undefined' ? passivePercOverride : false,
        _spellDCOverride: typeof spellDCOverride !== 'undefined' ? spellDCOverride : false,
        _spellAtkOverride: typeof spellAtkOverride !== 'undefined' ? spellAtkOverride : false,
        _bgImage: window.imagemFundoCustomizada || '',
    };
}

window.CharacterDataHelper = {
    collectData: collectData
};

// ── Inicialização (Boot) da Ficha Inteira ──
window.addEventListener('DOMContentLoaded', () => {
    function safeStep(nome, fn) {
        try { fn(); } catch (e) { console.error(`Erro ao restaurar "${nome}":`, e); }
    }

    const dataEl = document.getElementById('__dados_exportados__');
    if (dataEl && dataEl.textContent) {
        try { window.SHEET_DATA = JSON.parse(dataEl.textContent); }
        catch (e) { console.error("Erro ao carregar dados", e); window.SHEET_DATA = {}; }
    } else {
        window.SHEET_DATA = {};
    }

    // Distribuição dos dados para os módulos
    profStates = window.SHEET_DATA._profStates || {};
    saveProfs = window.SHEET_DATA._saveProfs || {};
    attacks = window.SHEET_DATA._attacks || [];
    window.spellSlots = window.SHEET_DATA._spellSlots || {};
    window.spells = window.SHEET_DATA._spells || {};
    spellDCOverride = window.SHEET_DATA._spellDCOverride || false;
    inspiration = window.SHEET_DATA._inspiration || false;
    deathSaves = window.SHEET_DATA._deathSaves || { s: [false, false, false], f: [false, false, false] };
    limitedResources = window.SHEET_DATA._limitedResources || [];
    feats = window.SHEET_DATA._feats || [];
    passivePercOverride = window.SHEET_DATA._passivePercOverride || false;
    window.imagemFundoCustomizada = window.SHEET_DATA._bgImage || '';
    window.secondarySpellSlots = window.SHEET_DATA._secondarySpellSlots || {};

    // Montagem das estruturas HTML base
    if (typeof aplicarFundoCustomizado === 'function') safeStep('fundo customizado', aplicarFundoCustomizado);
    safeStep('atributos', buildAttrs);
    safeStep('resistências', buildSaves);
    safeStep('perícias', buildSkills);
    if (typeof renderFeats === 'function') safeStep('talentos', renderFeats);

    // Render de módulos isolados (Combate/Magia)
    safeStep('ataques', () => { if (typeof renderAttacks === 'function') { if (attacks.length === 0) addAttack(); else renderAttacks(); } });

    if (typeof refreshSpellSystem === 'function') {
        safeStep('sistema de magias atualizado', () => refreshSpellSystem());
    }

    if (typeof renderLimitedResources === 'function') safeStep('recursos limitados', renderLimitedResources);

    // Preenchimento dos inputs
    safeStep('campos salvos', () => {
        Object.entries(window.SHEET_DATA).forEach(([k, v]) => {
            if (k.startsWith('_') || k.startsWith('spell-') || k.startsWith('slot-')) return;
            const el = document.getElementById(k);
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
                el.value = v;
            }
        });

        // Restauração garantida do nível salvo
        const lvlEl = document.getElementById('char-level');
        if (lvlEl && window.SHEET_DATA['char-level'] !== undefined) {
            lvlEl.value = window.SHEET_DATA['char-level'];
        }
    });

    // Restauração de UI e Visual
    safeStep('salvamentos contra morte', () => {
        ['s', 'f'].forEach(t => deathSaves[t].forEach((v, i) => {
            const ds = document.getElementById(`ds-${t}${i + 1}`);
            if (ds) ds.classList.toggle('filled', v);
        }));
    });

    safeStep('inspiração', () => {
        if (inspiration) {
            const insp = document.getElementById('insp-box');
            if (insp) insp.classList.add('active');
        }
    });

    safeStep('tema', () => {
        if (window.SHEET_DATA._theme && typeof changeTheme === 'function') changeTheme(window.SHEET_DATA._theme);
        if (window.SHEET_DATA._theme === 'custom' && typeof applyAllCustomColors === 'function') applyAllCustomColors();
    });

    safeStep('avatar', () => {
        if (window.SHEET_DATA._avatar && window.SHEET_DATA._avatar.startsWith('data:image')) {
            const img = document.getElementById('char-avatar');
            const ph = document.getElementById('avatar-placeholder');
            const btn = document.getElementById('avatar-reset-btn');
            if (img && ph) {
                img.src = window.SHEET_DATA._avatar;
                img.style.display = 'block';
                ph.style.display = 'none';
                if (btn) btn.style.display = 'block';
            }
        }
    });

    // Cálculos e Disparos finais
    safeStep('recálculo de atributos/cabeçalho', () => {
        onAttrChange();
        updateHeader();
        updateProfBonus();
        if (typeof updateHPBar === 'function') updateHPBar();
    });

    safeStep('sobrescrita de percepção', () => {
        if (passivePercOverride && window.SHEET_DATA['passive-perc'] !== undefined) {
            const ppEl = document.getElementById('passive-perc');
            if (ppEl) ppEl.value = window.SHEET_DATA['passive-perc'];
        }
    });

    safeStep('proficiência em resistências', () => {
        ATTRS.forEach(a => {
            const check = document.getElementById('save-check-' + a.id);
            if (check) check.className = 'save-check' + (saveProfs[a.id] ? ' active' : '');
        });
    });
});

function switchTraitTab(index) {
    const tabs = document.querySelectorAll('.trait-tab');
    const panes = document.querySelectorAll('.trait-tab-pane');
    tabs.forEach((tab, i) => { tab.classList.toggle('active', i === index); });
    panes.forEach((pane, i) => { pane.classList.toggle('active', i === index); });
}

function switchInvTab(idx, tabEl) {
    document.querySelectorAll('.inv-tab').forEach(t => t.classList.remove('active'));
    if (tabEl) tabEl.classList.add('active');
    document.querySelectorAll('.inv-tab-pane').forEach((pane, i) => {
        const isActive = (i === idx);
        pane.style.display = isActive ? 'block' : 'none';
        pane.classList.toggle('active', isActive);
    });
}

function updateSpellDC() {
    const pb = getProfBonus();
    const spellAttrSelect = document.getElementById('spell-ability');
    const attrKey = spellAttrSelect ? spellAttrSelect.value.toLowerCase() : 'int';
    const mod = getMod(getAttrVal(attrKey));

    const calculatedDC = 8 + pb + mod;
    const calculatedAtk = (pb + mod) >= 0 ? `+${pb + mod}` : `${pb + mod}`;

    const dcEl = document.getElementById('spell-dc');
    if (dcEl) {
        dcEl.placeholder = calculatedDC;
        if (!spellDCOverride) dcEl.value = '';
    }

    const atkEl = document.getElementById('spell-atk');
    if (atkEl) {
        atkEl.placeholder = calculatedAtk;
        if (!spellAtkOverride) atkEl.value = '';
    }
}

window.onSpellDCInput = function (el) {
    if (!el) return;
    let parsed = parseInt(el.value);
    if (isNaN(parsed)) {
        spellDCOverride = false;
        updateSpellDC();
    } else {
        spellDCOverride = true;
        el.value = parsed;
    }
};

window.onSpellAtkInput = function (el) {
    if (!el) return;
    let rawValue = el.value.replace('+', '').trim();
    let parsed = parseInt(rawValue);
    if (isNaN(parsed)) {
        spellAtkOverride = false;
        updateSpellDC();
    } else {
        spellAtkOverride = true;
        el.value = parsed >= 0 ? `+${parsed}` : `${parsed}`;
    }
};

window.handleSpellDCBlur = function (el) {
    if (el.value.trim() === '' || isNaN(parseInt(el.value))) {
        el.value = '';
        spellDCOverride = false;
        updateSpellDC();
    }
};

window.handleSpellAtkBlur = function (el) {
    if (el.value.trim() === '') {
        el.value = '';
        spellAtkOverride = false;
        updateSpellDC();
    }
};

window.onArmorClassInput = function (el) {
    if (!el) return;
    let parsed = parseInt(el.value);

    if (isNaN(parsed)) {
        window.acOverride = false;
        if (typeof updateArmorClass === 'function') {
            updateArmorClass();
        } else {
            const dexMod = typeof getMod === 'function' && typeof getAttrVal === 'function' ? getMod(getAttrVal('dex')) : 0;
            el.value = 10 + dexMod;
        }
    } else {
        window.acOverride = true;
        el.value = parsed;
    }
};
