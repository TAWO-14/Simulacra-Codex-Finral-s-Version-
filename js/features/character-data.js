window.SHEET_DATA = {};
let profStates = {};
let saveProfs = {};
let inspiration = false;
let deathSaves = {
    s: [false, false, false],
    f: [false, false, false]
};
let attacks = [];
let spellSlots = {};
let spells = {};
let limitedResources = [];
let initiativeOverride = false;
let passivePercOverride = false;
let spellDCOverride = false; 
window.imagemFundoCustomizada = window.imagemFundoCustomizada || ''; 

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
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

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

function buildSpells() {
    const leftEl = document.getElementById('spells-left');
    const rightEl = document.getElementById('spells-right');
    if (!leftEl || !rightEl) return;
    leftEl.innerHTML = '';
    rightEl.innerHTML = '';
    [0, 1, 2, 3, 4].forEach(l => buildLevelBlock(l, leftEl));
    [5, 6, 7, 8, 9].forEach(l => buildLevelBlock(l, rightEl));

    function buildLevelBlock(level, container) {
        if (!spells[level] || spells[level].length === 0) spells[level] = [{
            name: '',
            prepped: false
        }];
        const panel = document.createElement('div');
        panel.className = 'panel mb12';
        const levelLabel = level === 0 ? 'Truques' : `Nível ${level}`;
        let slotsHTML = '';
        if (level > 0) {
            if (!spellSlots[level]) spellSlots[level] = {
                total: 0,
                used: 0
            };
            slotsHTML = `<div style="display:flex; align-items:center; gap:6px; margin-left:auto;"><span style="font-size:10px; color:var(--text3);">Espaços:</span><input type="number" value="${spellSlots[level].total}" min="0" max="9" style="width:36px; text-align:center; font-size:12px;" onchange="setSlotTotal(${level},this.value)" id="slot-total-${level}"><span id="slot-pips-${level}" style="display:flex; gap:3px;"></span></div>`;
        }
        panel.innerHTML = `<div class="spell-level-header"><div class="spell-level-badge">${level}</div><div style="font-family:'Cinzel',serif; font-size:12px; letter-spacing:1px; color:var(--text2);">${levelLabel}</div>${slotsHTML}</div><div class="spell-list" id="spell-list-${level}"></div><button class="add-btn" onclick="addSpellRow(${level})">+ Adicionar</button>`;
        container.appendChild(panel);
        renderSpellList(level);
        if (level > 0) updateSlotPips(level);
    }
}

function renderSpellList(level) {
    const list = document.getElementById('spell-list-' + level);
    if (!list) return;
    if (!spells[level] || spells[level].length === 0) spells[level] = [{
        name: '',
        prepped: false
    }];
    list.innerHTML = spells[level].map((sp, i) => spellRowHTML(level, i, sp)).join('');
}

function spellRowHTML(level, i, sp) {
    const prepCheck = level > 0 ? `<div class="spell-prep ${sp.prepped ? 'prepped' : ''}" onclick="toggleSpellPrep(${level},${i})" title="Preparado">✔</div>` : '<div style="width:13px; flex-shrink:0;"></div>';
    return `<div class="spell-row" id="spell-row-${level}-${i}">${prepCheck}<input type="text" value="${escapeHTML(sp.name)}" placeholder="Nome do feitiço..." oninput="updateSpell(${level},${i},this.value)" style="flex:1;"><div class="spell-row-del" onclick="removeSpell(${level}, ${i})" title="Remover">×</div></div>`;
}

function addSpellRow(level) {
    if (!spells[level]) spells[level] = [];
    spells[level].push({
        name: '',
        prepped: false
    });
    renderSpellList(level);
}

function removeSpell(level, i) {
    if (spells[level]) {
        spells[level].splice(i, 1);
        renderSpellList(level);
    }
}

function buildSlotOverview() {
    const grid = document.getElementById('slots-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let l = 1; l <= 9; l++) {
        if (!spellSlots[l]) spellSlots[l] = {
            total: 0,
            used: 0
        };
        const block = document.createElement('div');
        block.className = 'slot-block';

        block.innerHTML = `
          <input type="number" 
                value="${spellSlots[l].total}" 
                min="0" 
                max="9" 
                class="sl-num-input" 
                onchange="setSlotTotal(${l}, this.value)" 
                id="slot-ov-${l}">
          <div class="sl-num">Nível ${l}</div>
          <div class="sl-pips" id="sl-pips-${l}"></div>
        `;
        grid.appendChild(block);
        updateSlotPips(l);
    }
}

function onAttrChange() {
    ATTRS.forEach(a => {
        const el = document.getElementById('attr-mod-' + a.id);
        if (el) el.textContent = fmtMod(getMod(getAttrVal(a.id)));
    });
    updateSaves();
    updateSkills();
    updateInitiative();
    updateSpellDC();
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
    updateSpellDC();
}

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

function toggleSaveProf(id) {
    saveProfs[id] = !saveProfs[id];
    document.getElementById('save-check-' + id).className = 'save-check' + (saveProfs[id] ? ' active' : '');
    updateSaves();
}

function cycleSkillProf(id) {
    profStates[id] = ((profStates[id] || 0) + 1) % 3;
    updateSkills();
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
    attacks.push({
        name: '',
        bonus: '',
        damage: ''
    });
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

function updateHeader() {
    document.getElementById('header-name').textContent = document.getElementById('char-name')?.value || 'Nome do Personagem';
    const sub = document.getElementById('header-subtitle');
    if (sub && !sub.value) {
        sub.placeholder = [document.getElementById('char-class')?.value, document.getElementById('char-race')?.value, document.getElementById('char-align')?.value].filter(Boolean).join(' · ') || 'Classe · Raça · Alinhamento';
    }
}

function updateSpellDC() {
    const ability = document.getElementById('spell-ability')?.value;
    const dcEl = document.getElementById('spell-dc');
    const atkEl = document.getElementById('spell-atk');
    if (!ability) {
        if (!spellDCOverride && dcEl) dcEl.value = '';
        if (atkEl) atkEl.textContent = '—';
        return;
    }
    const mod = getMod(getAttrVal(ability)),
        pb = getProfBonus();
    if (!spellDCOverride && dcEl) dcEl.value = 8 + mod + pb;
    if (atkEl) atkEl.textContent = fmtMod(mod + pb);
}

function setSlotTotal(level, val) {
    const n = Math.max(0, Math.min(9, parseInt(val) || 0));
    spellSlots[level] = spellSlots[level] || {
        total: 0,
        used: 0
    };
    spellSlots[level].total = n;
    if (spellSlots[level].used > n) spellSlots[level].used = n;
    if (document.getElementById('slot-ov-' + level)) document.getElementById('slot-ov-' + level).value = n;
    if (document.getElementById('slot-total-' + level)) document.getElementById('slot-total-' + level).value = n;
    updateSlotPips(level);
}

function updateSlotPips(level) {
    const s = spellSlots[level] || {
        total: 0,
        used: 0
    };
    ['sl-pips-', 'slot-pips-'].forEach(prefix => {
        const el = document.getElementById(prefix + level);
        if (!el) return;
        el.innerHTML = '';
        for (let i = 0; i < s.total; i++) {
            const pip = document.createElement('div');
            pip.className = (prefix === 'sl-pips-' ? 'sl-pip' : 'slot-pip') + (i < s.used ? ' used' : ' avail');
            pip.onclick = () => {
                if (i < s.used) s.used--;
                else s.used++;
                updateSlotPips(level);
            };
            el.appendChild(pip);
        }
    });
}

function toggleSpellPrep(level, i) {
    if (!spells[level] || !spells[level][i]) return;
    spells[level][i].prepped = !spells[level][i].prepped;
    const el = document.getElementById(`spell-row-${level}-${i}`)?.querySelector('.spell-prep');
    if (el) el.className = 'spell-prep' + (spells[level][i].prepped ? ' prepped' : '');
}

function updateSpell(level, i, val) {
    if (!spells[level]) spells[level] = [];
    if (!spells[level][i]) spells[level][i] = {
        name: '',
        prepped: false
    };
    spells[level][i].name = val;
}

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
        _inspiration: inspiration,
        _deathSaves: deathSaves,
        _attacks: attacks,
        _spellSlots: spellSlots,
        _spells: spells,
        _sanity: sanity,
        _theme: document.body.getAttribute('data-theme') || 'default',
        _avatar: avatarSrc,
        _limitedResources: limitedResources,
        _feats: feats,
        _initiativeOverride: initiativeOverride,
        _spellDCOverride: spellDCOverride,
        _passivePercOverride: passivePercOverride,
        _bgImage: window.imagemFundoCustomizada || '',
    };
}

const CharacterData = {
    collectData: collectData
};
