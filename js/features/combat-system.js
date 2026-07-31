/* ==========================================================================
   COMBAT SYSTEM & CORE FUNCTIONS
   ========================================================================== */

// ── Utilitários Base ──
function getMod(score) {
    return Math.floor((score - 10) / 2);
}

function fmtMod(n) {
    return (n >= 0 ? '+' : '') + n;
}

function getProfBonus() {
    return Math.ceil((parseInt(document.getElementById('char-level')?.value) || 1) / 4) + 1;
}

function getAttrVal(id) {
    return parseInt(document.getElementById('attr-score-' + id)?.value) || 10;
}

function escapeHTML(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')   // ← parênteses adicionados
        .replace(/"/g, '&quot;');
}


// ── Atributos, Testes e Perícias ──
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

function onPassivePercInput() {
    passivePercOverride = true;
}

function escapeHTML(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

function onAttrChange() {
    ATTRS.forEach(a => {
        const el = document.getElementById('attr-mod-' + a.id);
        if (el) el.textContent = fmtMod(getMod(getAttrVal(a.id)));
    });
    updateSaves();
    updateSkills();
    updateInitiative();
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

// ── Vida e Combate ──
function updateHPBar() {
    const max = parseInt(document.getElementById('hp-max')?.value) || 1;
    const cur = parseInt(document.getElementById('hp-current')?.value) || 0;
    const temp = parseInt(document.getElementById('hp-temp')?.value) || 0;
    const total = max + temp;
    const hpPct = Math.max(0, Math.min(100, (cur / total) * 100));
    const tempPct = Math.max(0, Math.min(100, (temp / total) * 100));
    const fill = document.getElementById('hp-bar-fill');
    const fillTemp = document.getElementById('hp-bar-temp');
    const curEl = document.getElementById('hp-current');
    const badge = document.getElementById('hp-temp-badge');
    const badgeLbl = document.getElementById('hp-temp-label');
    
    if (fill && fillTemp && curEl) {
        fill.style.width = hpPct + '%';
        fillTemp.style.width = tempPct + '%';
        const hpRatio = cur / max;
        const status = hpRatio <= 0.25 ? ' danger' : hpRatio <= 0.5 ? ' hurt' : '';
        fill.className = 'hp-bar-fill' + status;
        curEl.className = 'hp-current' + status;
    }
    if (badge && badgeLbl) {
        badge.style.display = temp > 0 ? 'inline-flex' : 'none';
        badgeLbl.textContent = temp;
    }
}

function changeHP(delta) {
    const curEl = document.getElementById('hp-current');
    const tempEl = document.getElementById('hp-temp');
    const max = parseInt(document.getElementById('hp-max')?.value) || 0;
    let cur = parseInt(curEl.value) || 0;
    let temp = parseInt(tempEl.value) || 0;
    
    if (delta < 0) {
        const dmg = Math.abs(delta);
        const absorbed = Math.min(temp, dmg);
        temp = temp - absorbed;
        cur = Math.max(0, cur - (dmg - absorbed));
        tempEl.value = temp;
    } else {
        cur = Math.min(max, cur + delta);
    }
    curEl.value = cur;
    updateHPBar();
}

function changeHPBy(sign) {
    changeHP((parseInt(document.getElementById('hp-delta')?.value) || 1) * sign);
}

function toggleInspiration() {
    inspiration = !inspiration;
    document.getElementById('insp-box').className = 'insp-box' + (inspiration ? ' active' : '');
}

function toggleDS(type, n) {
    const arr = deathSaves[type];
    arr[n - 1] = !arr[n - 1];
    document.getElementById(`ds-${type}${n}`).classList.toggle('filled', arr[n - 1]);
}

function addAttack() {
    attacks.push({ name: '', bonus: '', damage: '' });
    renderAttacks();
}

function removeAttack(i) {
    attacks.splice(i, 1);
    renderAttacks();
}

function renderAttacks() {
    const tbody = document.getElementById('attacks-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    attacks.forEach((atk, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><input type="text" value="${escapeHTML(atk.name)}" placeholder="Espada Longa" oninput="attacks[${i}].name=this.value"></td><td style="width:80px;"><input type="text" value="${escapeHTML(atk.bonus)}" placeholder="+5" oninput="attacks[${i}].bonus=this.value"></td><td><input type="text" value="${escapeHTML(atk.damage)}" placeholder="1d8+3 / Cortante" oninput="attacks[${i}].damage=this.value"></td><td class="attack-row-del" onclick="removeAttack(${i})">×</td>`;
        tbody.appendChild(tr);
    });
}

// ── Recursos Limitados Integrados ──
function addLimitedResource(data) {
    const res = data || { name: '', total: 3, used: 0 };
    if (!Array.isArray(limitedResources)) limitedResources = [];
    limitedResources.push(res);
    renderLimitedResources();
}

function removeLimitedResource(i) {
    if (limitedResources[i]) {
        limitedResources.splice(i, 1);
        renderLimitedResources();
    }
}

function renderLimitedResources() {
    const container = document.getElementById('limited-resources-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (!Array.isArray(limitedResources)) limitedResources = [];

    limitedResources.forEach((res, i) => {
        const block = document.createElement('div');
        block.className = 'lres-block';
        
        const safeTotal = Math.max(0, parseInt(res.total) || 0);
        const segsHTML = Array.from({ length: safeTotal }, (_, p) =>
            `<div class="lres-seg${p < res.used ? ' filled' : ''}" onclick="toggleLresSeg(${i},${p})" title="${p + 1}"></div>`
        ).join('');

        block.innerHTML = `
          <div class="lres-top">
            <input class="lres-name" value="${escapeHTML(res.name)}" placeholder="Ex: Psi Points, Bardic Inspiration…" oninput="if(limitedResources[${i}]) limitedResources[${i}].name=this.value">
            <span class="lres-counter">${res.used}<span class="lres-sep"> / </span></span>
            <input type="number" class="lres-num" min="0" max="99" value="${safeTotal}" title="Máximo" oninput="lresSetTotal(${i},this.value)">
            <span class="lres-reset" onclick="lresReset(${i})" title="Restaurar todos">↺</span>
            <span class="lres-del" onclick="removeLimitedResource(${i})" title="Remover">×</span>
          </div>
          <div class="lres-bar" id="lres-bar-${i}">${segsHTML}</div>
        `;
        container.appendChild(block);
    });
}

function toggleLresSeg(i, p) {
    const res = limitedResources[i];
    if (!res) return;
    res.used = (p + 1 === res.used) ? 0 : p + 1;
    renderLimitedResources();
}

function lresSetTotal(i, val) {
    if (!limitedResources[i]) return;
    const n = Math.max(0, Math.min(99, parseInt(val) || 0));
    limitedResources[i].total = n;
    if (limitedResources[i].used > n) limitedResources[i].used = n;
    renderLimitedResources();
}

function lresReset(i) {
    if (limitedResources[i]) {
        limitedResources[i].used = 0;
        renderLimitedResources();
    }
}

// ── Auxiliares de Interface ──
function updateHeader() {
    const nameEl = document.getElementById('header-name');
    if (nameEl) nameEl.textContent = document.getElementById('char-name')?.value || 'Nome do Personagem';
    
    const sub = document.getElementById('header-subtitle');
    if (sub && !sub.value) {
        sub.placeholder = [document.getElementById('char-class')?.value, document.getElementById('char-race')?.value, document.getElementById('char-align')?.value].filter(Boolean).join(' · ') || 'Classe · Raça · Alinhamento';
    }
}

function switchTab(idx) {
    document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    document.querySelectorAll('.page').forEach((p, i) => p.classList.toggle('active', i === idx));
}

// ── Coleta de Dados para Salvamento ──
function collectData() {
    const data = {};
    document.querySelectorAll('[id]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
            if (el.type !== 'file') data[el.id] = el.value;
        }
    });
    const avatarImg = document.getElementById('char-avatar');
    const avatarSrc = (avatarImg && avatarImg.src.startsWith('data:image')) ? avatarImg.src : '';
    return {
        ...data,
        _profStates: profStates,
        _saveProfs: saveProfs,
        _inspiration: inspiration,
        _deathSaves: deathSaves,
        _attacks: attacks,
        _spellSlots: typeof spellSlots !== 'undefined' ? spellSlots : {},
        _spells: typeof spells !== 'undefined' ? spells : {},
        _sanity: typeof sanity !== 'undefined' ? sanity : 10,
        _theme: document.getElementById('theme-selector')?.value || 'default',
        _avatar: avatarSrc,
        _limitedResources: limitedResources,
        _feats: typeof feats !== 'undefined' ? feats : [],
        _initiativeOverride: initiativeOverride,
        _spellDCOverride: typeof spellDCOverride !== 'undefined' ? spellDCOverride : false,
        _passivePercOverride: passivePercOverride,
        _bgImage: typeof imagemFundoCustomizada !== 'undefined' ? imagemFundoCustomizada : '',
    };
}

// ── Inicialização (DOMContentLoaded) ──
window.addEventListener('DOMContentLoaded', () => {
    function safeStep(nome, fn) {
        try {
            fn();
        } catch (e) {
            console.error(`Erro ao restaurar "${nome}":`, e);
        }
    }

    const dataEl = document.getElementById('__dados_exportados__');
    if (dataEl && dataEl.textContent) {
        try {
            window.SHEET_DATA = JSON.parse(dataEl.textContent);
        } catch (e) {
            console.error("Erro ao carregar dados", e);
            window.SHEET_DATA = {};
        }
    } else {
        window.SHEET_DATA = {};
    }

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
    imagemFundoCustomizada = window.SHEET_DATA._bgImage || '';

    // Renderizações base
    if (typeof aplicarFundoCustomizado === 'function') safeStep('fundo customizado', aplicarFundoCustomizado);
    safeStep('atributos', buildAttrs);
    safeStep('resistências', buildSaves);
    safeStep('perícias', buildSkills);
    if (typeof renderFeats === 'function') safeStep('talentos', renderFeats);
    safeStep('ataques', () => { if (attacks.length === 0) addAttack(); else renderAttacks(); });
    
    // Suporte flexível para inicialização do sistema de magias
    if (typeof SpellsModule !== 'undefined') {
        safeStep('magias', () => SpellsModule.buildSpells());
        safeStep('espaços de magia', () => SpellsModule.buildSlotOverview());
    } else if (typeof buildSpells === 'function') {
        safeStep('magias', buildSpells);
        if (typeof buildSlotOverview === 'function') safeStep('espaços de magia', buildSlotOverview);
    }

    safeStep('recursos limitados', renderLimitedResources);

    // Preenchimento dos campos salvos
    safeStep('campos salvos', () => {
        Object.entries(window.SHEET_DATA).forEach(([k, v]) => {
            if (k.startsWith('_')) return;
            const el = document.getElementById(k);
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
                el.value = v;
            }
        });
    });

    // Estados visuais
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

    // Recálculos de atributos e cabeçalho
    safeStep('recálculo de atributos/cabeçalho', () => {
        onAttrChange();
        updateHeader();
        updateProfBonus();
        updateHPBar();
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
});