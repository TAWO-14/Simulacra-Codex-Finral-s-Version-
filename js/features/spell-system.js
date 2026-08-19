/* ==========================================================================
   SPELL SYSTEM
   ========================================================================== */

function buildSpells() {
    const leftEl = document.getElementById('spells-left');
    const rightEl = document.getElementById('spells-right');
    if (!leftEl || !rightEl) return;
    leftEl.innerHTML = '';
    rightEl.innerHTML = '';
    [0, 1, 2, 3, 4].forEach(l => buildLevelBlock(l, leftEl));
    [5, 6, 7, 8, 9].forEach(l => buildLevelBlock(l, rightEl));

    function buildLevelBlock(level, container) {
        if (!spells[level] || spells[level].length === 0) spells[level] = [{ name: '', prepped: false }];
        const panel = document.createElement('div');
        panel.className = 'panel mb12';
        const levelLabel = level === 0 ? 'Truques' : `Nível ${level}`;
        let slotsHTML = '';
        if (level > 0) {
            if (!spellSlots[level]) spellSlots[level] = { total: 0, used: 0 };
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
    if (!spells[level] || spells[level].length === 0) spells[level] = [{ name: '', prepped: false }];
    list.innerHTML = spells[level].map((sp, i) => spellRowHTML(level, i, sp)).join('');
}

function spellRowHTML(level, i, sp) {
    const prepCheck = level > 0 ? `<div class="spell-prep ${sp.prepped ? 'prepped' : ''}" onclick="toggleSpellPrep(${level},${i})" title="Preparado">✔</div>` : '<div style="width:13px; flex-shrink:0;"></div>';
    return `<div class="spell-row" id="spell-row-${level}-${i}">${prepCheck}<input type="text" value="${escapeHTML(sp.name)}" placeholder="Nome do feitiço..." oninput="updateSpell(${level},${i},this.value)" style="flex:1;"><div class="spell-row-del" onclick="removeSpell(${level}, ${i})" title="Remover">×</div></div>`;
}

function addSpellRow(level) {
    if (!spells[level]) spells[level] = [];
    spells[level].push({ name: '', prepped: false });
    renderSpellList(level);
}

function removeSpell(level, i) {
    if (spells[level]) {
        spells[level].splice(i, 1);
        renderSpellList(level);
    }
}

function toggleSpellPrep(level, i) {
    if (!spells[level] || !spells[level][i]) return;
    spells[level][i].prepped = !spells[level][i].prepped;
    const el = document.getElementById(`spell-row-${level}-${i}`)?.querySelector('.spell-prep');
    if (el) el.className = 'spell-prep' + (spells[level][i].prepped ? ' prepped' : '');
}

function updateSpell(level, i, val) {
    if (!spells[level]) spells[level] = [];
    if (!spells[level][i]) spells[level][i] = { name: '', prepped: false };
    spells[level][i].name = val;
}

function buildSlotOverview() {
    const grid = document.getElementById('slots-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let l = 1; l <= 9; l++) {
        if (!spellSlots[l]) spellSlots[l] = { total: 0, used: 0 };
        const block = document.createElement('div');
        block.className = 'slot-block';
        block.innerHTML = `
          <input type="number" value="${spellSlots[l].total}" min="0" max="9" class="sl-num-input" onchange="setSlotTotal(${l}, this.value)" id="slot-ov-${l}">
          <div class="sl-num">Nível ${l}</div>
          <div class="sl-pips" id="sl-pips-${l}"></div>
        `;
        grid.appendChild(block);
        updateSlotPips(l);
    }
}

function setSlotTotal(level, val) {
    const n = Math.max(0, Math.min(9, parseInt(val) || 0));
    spellSlots[level] = spellSlots[level] || { total: 0, used: 0 };
    spellSlots[level].total = n;
    if (spellSlots[level].used > n) spellSlots[level].used = n;
    if (document.getElementById('slot-ov-' + level)) document.getElementById('slot-ov-' + level).value = n;
    if (document.getElementById('slot-total-' + level)) document.getElementById('slot-total-' + level).value = n;
    updateSlotPips(level);
}

function updateSlotPips(level) {
    const s = spellSlots[level] || { total: 0, used: 0 };
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

/* Variáveis de controle para saber se o jogador digitou manualmente */
window.spellDCOverride = window.spellDCOverride || false;
window.spellAtkOverride = window.spellAtkOverride || false;

function updateSpellDC() {
    const ability = document.getElementById('spell-ability')?.value;
    const dcEl = document.getElementById('spell-dc');
    const atkEl = document.getElementById('spell-atk');

    if (!ability) {
        if (!window.spellDCOverride && dcEl) dcEl.value = '';
        if (!window.spellAtkOverride && atkEl) atkEl.value = ''; // Agora usa .value e respeita o override
        return;
    }

    const mod = getMod(getAttrVal(ability)),
        pb = getProfBonus();

    if (!window.spellDCOverride && dcEl) {
        dcEl.value = 8 + mod + pb;
    }

    if (!window.spellAtkOverride && atkEl) {
        atkEl.value = fmtMod(mod + pb); // Agora usa .value em vez de textContent
    }
}
