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
let spellSlots = {};
let spells = {};
let sanity = 10;
let limitedResources = [];
let initiativeOverride = false;
let passivePercOverride = false;
let spellDCOverride = false; 
window.imagemFundoCustomizada = window.imagemFundoCustomizada || '';

// ── Utilitários Base ──
function getMod(score) { return Math.floor((score - 10) / 2); }
function fmtMod(n) { return (n >= 0 ? '+' : '') + n; }
function getProfBonus() { return Math.ceil((parseInt(document.getElementById('char-level')?.value) || 1) / 4) + 1; }
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
function onPassivePercInput() { passivePercOverride = true; }

function onAttrChange() {
    ATTRS.forEach(a => {
        const el = document.getElementById('attr-mod-' + a.id);
        if (el) el.textContent = fmtMod(getMod(getAttrVal(a.id)));
    });
    updateSaves();
    updateSkills();
    updateInitiative();
    
    // Delega a atualização do CD Mágico para o módulo de magias
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
        if (!passivePercOverride || ppEl.value === '') {
            passivePercOverride = false;
            const percProf = profStates['perception'] || 0;
            ppEl.value = 10 + getMod(getAttrVal('wis')) + (percProf === 2 ? pb * 2 : percProf === 1 ? pb : 0);
        }
    }
}

function updateInitiative() {
    const el = document.getElementById('initiative');
    if (el) {
        if (!initiativeOverride || el.value === '') {
            initiativeOverride = false;
            el.value = getMod(getAttrVal('dex'));
        }
    }
}

function updateProfBonus() {
    const el = document.getElementById('prof-bonus');
    if (el) el.textContent = fmtMod(getProfBonus());
    updateSaves();
    updateSkills();
    if (typeof updateSpellDC === 'function') updateSpellDC();
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
            if (el.type !== 'file') data[el.id] = el.value;
        }
    });
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
        _spells: typeof spells !== 'undefined' ? spells : {},
        _sanity: typeof sanity !== 'undefined' ? sanity : 10,
        _theme: document.body.getAttribute('data-theme') || 'default',
        _avatar: avatarSrc,
        _limitedResources: typeof limitedResources !== 'undefined' ? limitedResources : [],
        _feats: typeof feats !== 'undefined' ? feats : [],
        _initiativeOverride: initiativeOverride,
        _spellDCOverride: typeof spellDCOverride !== 'undefined' ? spellDCOverride : false,
        _passivePercOverride: passivePercOverride,
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
    spellSlots = window.SHEET_DATA._spellSlots || {};
    spells = window.SHEET_DATA._spells || {};
    sanity = window.SHEET_DATA._sanity !== undefined ? window.SHEET_DATA._sanity : 10;
    spellDCOverride = window.SHEET_DATA._spellDCOverride || false;
    inspiration = window.SHEET_DATA._inspiration || false;
    deathSaves = window.SHEET_DATA._deathSaves || { s: [false, false, false], f: [false, false, false] };
    limitedResources = window.SHEET_DATA._limitedResources || [];
    feats = window.SHEET_DATA._feats || [];
    initiativeOverride = window.SHEET_DATA._initiativeOverride || false;
    passivePercOverride = window.SHEET_DATA._passivePercOverride || false;
    window.imagemFundoCustomizada = window.SHEET_DATA._bgImage || '';

    // Montagem das estruturas HTML base
    if (typeof aplicarFundoCustomizado === 'function') safeStep('fundo customizado', aplicarFundoCustomizado);
    safeStep('atributos', buildAttrs);
    safeStep('resistências', buildSaves);
    safeStep('perícias', buildSkills);
    if (typeof renderFeats === 'function') safeStep('talentos', renderFeats);
    
    // Render de módulos isolados (Combate/Magia)
    safeStep('ataques', () => { if (typeof renderAttacks === 'function') { if (attacks.length === 0) addAttack(); else renderAttacks(); } });
    
    if (typeof SpellsModule !== 'undefined') {
        safeStep('magias', () => SpellsModule.buildSpells());
        safeStep('espaços de magia', () => SpellsModule.buildSlotOverview());
    } else if (typeof buildSpells === 'function') {
        safeStep('magias (legado)', buildSpells);
        if (typeof buildSlotOverview === 'function') safeStep('espaços de magia (legado)', buildSlotOverview);
    }
    
    if (typeof renderLimitedResources === 'function') safeStep('recursos limitados', renderLimitedResources);

    // Preenchimento dos inputs
    safeStep('campos salvos', () => {
        Object.entries(window.SHEET_DATA).forEach(([k, v]) => {
            if (k.startsWith('_')) return;
            const el = document.getElementById(k);
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
                el.value = v;
            }
        });
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

    safeStep('sobrescrita de iniciativa/percepção', () => {
        if (initiativeOverride && window.SHEET_DATA['initiative'] !== undefined) {
            const initEl = document.getElementById('initiative');
            if (initEl) initEl.value = window.SHEET_DATA['initiative'];
        }
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
});s
