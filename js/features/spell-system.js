/* ==========================================================================
   SPELL SYSTEM (MASTER-DETAIL)
   Abas de círculo, lista de magias + painel de detalhes, espaços de magia
   (slots) em duas grades e cálculo de CD / Ataque Mágico.
   ========================================================================== */
(function () {
  'use strict';

  const MAX_SPELL_LEVEL = 9;   // 0 = Truques ... 9 = 9º círculo
  const MAX_SLOTS = 9;         // máximo de pips por nível

  /* ----------------------------------------------------------------------
     ESTADO
     ---------------------------------------------------------------------- */

  let magiaArrastadaIndex = null;
  window.spellDCOverride = window.spellDCOverride || false;
  window.spellAtkOverride = window.spellAtkOverride || false;

  window.spells = window.spells || {};
  window.activeSpellIndex = window.activeSpellIndex || {};
  window.activeSpellTab = window.activeSpellTab || 0;

  window.spellSlots = window.spellSlots || {};
  window.secondarySpellSlots = window.secondarySpellSlots || {};
  window.activeSlotSet = window.activeSlotSet || 'primary';

  /* ----------------------------------------------------------------------
     HELPERS
     ---------------------------------------------------------------------- */
  const $ = id => document.getElementById(id);

  const esc = str => String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  window.escapeHTML = window.escapeHTML || esc;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const toInt = v => parseInt(v, 10) || 0;
  const toLevel = l => clamp(toInt(l), 0, MAX_SPELL_LEVEL);

  function getSpellList(level) {
    if (!Array.isArray(window.spells[level])) window.spells[level] = [];
    return window.spells[level];
  }

  function resolveIndex(level, index) {
    return index === undefined ? window.activeSpellIndex[level] : index;
  }

  function renderRich(text) {
    return typeof parseRichText === 'function'
      ? parseRichText(text)
      : esc(text).replace(/\n/g, '<br>');
  }

  function parseSpellTitle(raw) {
    const parts = String(raw || '').split('::').map(s => s.trim());
    return { name: parts.shift() || '', tags: parts.filter(Boolean) };
  }

  function normalizeSpells() {
    if (!window.spells || typeof window.spells !== 'object') window.spells = {};
    for (let l = 0; l <= MAX_SPELL_LEVEL; l++) {
      const list = Array.isArray(window.spells[l]) ? window.spells[l] : [];
      window.spells[l] = list
        .filter(sp => sp && typeof sp === 'object')
        .map(sp => Object.assign({}, sp, {
          name: String(sp.name || ''),
          prepped: !!sp.prepped,
          concentration: !!sp.concentration,
          desc: String(sp.desc || '')
        }));
      const idx = window.activeSpellIndex[l];
      if (idx !== undefined && !window.spells[l][idx]) delete window.activeSpellIndex[l];
    }
  }

  function ensureSpellStyles() {
    if ($('spell-system-styles')) return;
    const style = document.createElement('style');
    style.id = 'spell-system-styles';
    style.textContent = `
.spell-item-btn { width: 100%; min-width: 0; }
.spell-item-icons { display: flex; gap: 4px; width: 26px; flex-shrink: 0; justify-content: flex-start; font-size: 11px; line-height: 1; }
.spell-item-icons .sp-prep { color: var(--accent2, #e2b714); }
.spell-item-icons .sp-conc { color: var(--green, #22c55e); }
.spell-item-body { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 6px; flex: 1; min-width: 0; }
.spell-item-name { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spell-item-name.is-untitled { opacity: .55; font-style: italic; }
.spell-detail-head { display: flex; gap: 8px; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--border, #334155); }
.spell-tags-row { display: flex; align-items: center; gap: 20px; height: 20px; margin-bottom: 12px; font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--text2, #94a3b8); }
.spell-flag { display: flex; align-items: center; cursor: pointer; text-transform: uppercase; transition: color .2s; }
.spell-flag-prep:hover { color: var(--accent2, #e2b714); }
.spell-flag-conc:hover { color: var(--green, #22c55e); }
.h-btn.spell-del-btn { border-color: var(--red2, #ef4444); color: var(--red2, #ef4444); }
.spell-detail-col .rn-bar { top: -32px; height: 20px; display: flex; align-items: center; }`;
    document.head.appendChild(style);
  }

  /* ==========================================================================
     1. ABAS DE CÍRCULO
     ========================================================================== */
  window.buildSpellTabs = function (force) {
    const container = $('spell-tabs-container');
    if (!container) return false;
    const built = container.querySelectorAll('[id^="spell-pane-"]').length === MAX_SPELL_LEVEL + 1;
    if (built && !force) return true;

    const hasStaticTabs = !!document.querySelector('.spell-tab:not([data-generated])');

    let html = '';
    if (!hasStaticTabs) {
      html += '<div class="spell-tabs-header" data-generated="1">';
      for (let i = 0; i <= MAX_SPELL_LEVEL; i++) {
        html += `<button type="button" class="spell-tab${i === 0 ? ' active' : ''}" data-generated="1"
                    title="${i === 0 ? 'Truques' : i + 'º Círculo'}" onclick="switchSpellTab(${i})">${i === 0 ? 'Truques' : i + 'º'}</button>`;
      }
      html += '</div>';
    }

    for (let i = 0; i <= MAX_SPELL_LEVEL; i++) {
      html += `
        <div class="spell-tab-pane${i === 0 ? ' active' : ''}" id="spell-pane-${i}">
            <div class="spell-master-detail">
                <div class="spell-list-col">
                    <div class="spell-list-container" id="spell-list-${i}"></div>
                    <button type="button" class="add-btn mt8" onclick="addNewSpell(${i})">+ Nova Magia</button>
                </div>
                <div class="spell-detail-col" id="spell-detail-${i}" style="display: none;"></div>
                <div class="spell-empty-state" id="spell-empty-${i}"
                    style="display: flex; align-items: center; justify-content: center; flex-direction: column; color: var(--text3, #64748b); height: 100%;">
                    <span style="font-size: 24px; margin-bottom: 8px; opacity: 0.5;">🔮</span>
                    <span style="font-size: 11px; font-family: 'Cinzel', serif; letter-spacing: 1px; text-transform: uppercase;">Selecione ou crie uma magia</span>
                </div>
            </div>
        </div>`;
    }
    container.innerHTML = html;
    return true;
  };

  window.switchSpellTab = function (idx) {
    idx = toLevel(idx);
    window.activeSpellTab = idx;

    document.querySelectorAll('.spell-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === idx);
    });
    for (let i = 0; i <= MAX_SPELL_LEVEL; i++) {
      const pane = $('spell-pane-' + i);
      if (pane) pane.classList.toggle('active', i === idx);
    }

    renderSpellList(idx);
    ensureSpellDetail(idx);
  };

  /* ==========================================================================
     2. LISTA E DRAG & DROP
     ========================================================================== */
  function spellButtonHTML(level, sp, i, isActive) {
    const { name, tags } = parseSpellTitle(sp.name);
    const label = name || 'Nova Magia';

    const icons =
      (sp.prepped ? '<span class="sp-prep" title="Preparada">✦</span>' : '') +
      (sp.concentration ? '<span class="sp-conc" title="Concentração">◈</span>' : '');

    const pills = tags.map(t => `<span class="spell-pill">${esc(t)}</span>`).join('');

    return `
        <button type="button" 
            class="spell-item-btn${isActive ? ' active' : ''}" 
            draggable="true"
            ondragstart="window.onSpellDragStart(event, ${level}, ${i})"
            ondragover="event.preventDefault(); event.dataTransfer.dropEffect = 'move';"
            ondrop="window.onSpellDrop(event, ${level}, ${i})"
            onclick="selectSpell(${level}, ${i})" 
            title="${esc(sp.name || 'Nova Magia')}">
            <span class="spell-item-icons">${icons}</span>
            <span class="spell-item-body">
                <span class="spell-item-name${name ? '' : ' is-untitled'}">${esc(label)}</span>${pills}
            </span>
        </button>`;
  }

  window.onSpellDragStart = function (e, level, index) {
    magiaArrastadaIndex = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  window.onSpellDrop = function (e, level, targetIndex) {
    e.preventDefault();
    if (magiaArrastadaIndex === null || magiaArrastadaIndex === targetIndex) return;

    const list = getSpellList(level);
    const [movedSpell] = list.splice(magiaArrastadaIndex, 1);
    list.splice(targetIndex, 0, movedSpell);

    if (window.activeSpellIndex[level] === magiaArrastadaIndex) {
      window.activeSpellIndex[level] = targetIndex;
    } else if (
      window.activeSpellIndex[level] > magiaArrastadaIndex &&
      window.activeSpellIndex[level] <= targetIndex
    ) {
      window.activeSpellIndex[level]--;
    } else if (
      window.activeSpellIndex[level] < magiaArrastadaIndex &&
      window.activeSpellIndex[level] >= targetIndex
    ) {
      window.activeSpellIndex[level]++;
    }

    magiaArrastadaIndex = null;
    renderSpellList(level);
    if (typeof salvarDadosFicha === 'function') salvarDadosFicha();
  };

  /* ==========================================================================
     3. FUNÇÃO DE ORDENAÇÃO (CORRIGIDA E INTEGRADA)
     ========================================================================== */
  window.ordenarMagiasAtuais = function (criterio) {
    const level = toLevel(window.activeSpellTab);
    const list = getSpellList(level);

    if (!list || !Array.isArray(list) || list.length === 0) return;

    const getName = (sp) => {
      if (!sp || !sp.name) return '';
      return parseSpellTitle(sp.name).name.toLowerCase();
    };

    if (criterio === 'alfabetica-asc') {
      list.sort((a, b) => getName(a).localeCompare(getName(b)));
    } else if (criterio === 'alfabetica-desc') {
      list.sort((a, b) => getName(b).localeCompare(getName(a)));
    } else if (criterio === 'preparadas') {
      list.sort((a, b) => (b.prepped ? 1 : 0) - (a.prepped ? 1 : 0));
    }

    const selectElem = $('spellSortSelect');
    if (selectElem) selectElem.value = '';

    renderSpellList(level);
    if (typeof window.salvarDadosFicha === 'function') window.salvarDadosFicha();
  };

  function syncSpellPanels(level) {
    const detail = $('spell-detail-' + level);
    const empty = $('spell-empty-' + level);
    if (!detail || !empty) return;

    const hasActive = !!getSpellList(level)[window.activeSpellIndex[level]];
    detail.style.display = hasActive ? 'block' : 'none';
    empty.style.display = hasActive ? 'none' : 'flex';

    if (!hasActive) {
      detail.innerHTML = '';
      delete detail.dataset.spellIndex;
    }
  }

  window.renderSpellList = function (level) {
    level = toLevel(level);
    const listEl = $('spell-list-' + level);
    if (!listEl) return;

    const active = window.activeSpellIndex[level];
    listEl.innerHTML = getSpellList(level)
      .map((sp, i) => spellButtonHTML(level, sp, i, i === active))
      .join('');

    syncSpellPanels(level);
  };

  /* ==========================================================================
     4. DETALHES E CRUD
     ========================================================================== */
  function renderSpellDetail(level, index, opts) {
    const detail = $('spell-detail-' + level);
    const spell = getSpellList(level)[index];
    if (!detail || !spell) return;

    const key = `${level}-${index}`;
    detail.innerHTML = `
        <div class="spell-detail-head">
            <input type="text" id="spell-title-${key}" class="spell-title-input"
                placeholder="Nome da Magia :: Tag :: Tag"
                oninput="updateSpell(${level}, ${index}, 'name', this.value)">
            <button type="button" class="h-btn spell-del-btn" title="Excluir Magia"
                onclick="removeSpell(${level}, ${index})">🗑️</button>
        </div>

        <div class="spell-tags-row">
            <label class="spell-flag spell-flag-prep">
                <input type="checkbox" id="spell-prep-${key}" class="ui-toggle ui-toggle-square"
                    onchange="updateSpell(${level}, ${index}, 'prepped', this.checked)"> Preparada
            </label>
            <label class="spell-flag spell-flag-conc">
                <input type="checkbox" id="spell-conc-${key}" class="ui-toggle ui-toggle-circle"
                    onchange="updateSpell(${level}, ${index}, 'concentration', this.checked)"> Concentração
            </label>
        </div>

        <div class="rn-wrap">
            <div class="rn-bar">
                <button type="button" class="rn-toggle" id="spell-toggle-${key}"
                    onclick="toggleSpellRN(${level}, ${index})">👁</button>
            </div>
            <textarea id="spell-desc-${key}" rows="14" placeholder="Descreva os efeitos da magia..."
                oninput="updateSpell(${level}, ${index}, 'desc', this.value)"></textarea>
            <div class="rn-preview" id="rn-spell-desc-${key}" style="display: none;"
                ondblclick="editSpellRN(${level}, ${index})"></div>
        </div>`;

    $('spell-title-' + key).value = spell.name;
    $('spell-prep-' + key).checked = spell.prepped;
    $('spell-conc-' + key).checked = spell.concentration;
    $('spell-desc-' + key).value = spell.desc;

    detail.dataset.spellIndex = String(index);

    const mode = opts.edit === undefined ? (spell.desc.trim() ? 'preview' : 'edit') : (opts.edit ? 'edit' : 'preview');
    setSpellMode(level, index, mode);
  }

  function setSpellMode(level, index, mode, focus) {
    const key = `${level}-${index}`;
    const ta = $('spell-desc-' + key);
    const preview = $('rn-spell-desc-' + key);
    const btn = $('spell-toggle-' + key);
    if (!ta || !preview) return;

    if (mode === 'preview') {
      preview.innerHTML = renderRich(ta.value);
      preview.classList.add('rn-active');
      preview.style.display = 'block';
      ta.style.display = 'none';
      if (btn) { btn.classList.add('active'); btn.textContent = '✏️'; }
    } else {
      preview.classList.remove('rn-active');
      preview.style.display = 'none';
      ta.style.display = '';
      if (btn) { btn.classList.remove('active'); btn.textContent = '👁'; }
      if (focus) ta.focus();
    }
  }

  function ensureSpellDetail(level) {
    const list = getSpellList(level);
    if (!list || list.length === 0) { syncSpellPanels(level); return; }

    let idx = window.activeSpellIndex[level] !== undefined ? window.activeSpellIndex[level] : 0;
    if (!list[idx]) idx = 0;

    const detail = $('spell-detail-' + level);
    const alreadyShown = detail && detail.dataset.spellIndex === String(idx)
      && window.activeSpellIndex[level] === idx;

    if (!alreadyShown) selectSpell(level, idx, { edit: false });
  }

  window.selectSpell = function (level, index, opts) {
    level = toLevel(level);
    index = toInt(index);

    const list = getSpellList(level);
    if (!list || !list[index]) return;

    window.activeSpellIndex[level] = index;
    renderSpellList(level);
    renderSpellDetail(level, index, opts || {});
  };

  window.toggleSpellRN = function (level, index) {
    level = toLevel(level);
    index = resolveIndex(level, index);
    const preview = $(`rn-spell-desc-${level}-${index}`);
    if (!preview) return;
    setSpellMode(level, index, preview.classList.contains('rn-active') ? 'edit' : 'preview');
  };

  window.editSpellRN = function (level, index) {
    level = toLevel(level);
    setSpellMode(level, resolveIndex(level, index), 'edit', true);
  };

  window.addNewSpell = function (level) {
    level = toLevel(level);
    const list = getSpellList(level);
    list.push({ name: '', prepped: false, concentration: false, desc: '' });
    const index = list.length - 1;
    selectSpell(level, index, { edit: true });

    const title = $(`spell-title-${level}-${index}`);
    if (title) title.focus();

    const listEl = $('spell-list-' + level);
    if (listEl) listEl.scrollTop = listEl.scrollHeight;
  };

  window.updateSpell = function (level, index, field, value) {
    level = toLevel(level);
    const spell = getSpellList(level)[index];
    if (!spell) return;
    spell[field] = value;
    if (field !== 'desc') renderSpellList(level);
  };

  window.removeSpell = function (level, index) {
    level = toLevel(level);
    const list = getSpellList(level);
    if (!list[index]) return;
    if (!confirm('Tem certeza que deseja excluir esta magia?')) return;

    list.splice(index, 1);
    delete window.activeSpellIndex[level];

    if (list.length) {
      selectSpell(level, Math.min(index, list.length - 1));
    } else {
      renderSpellList(level);
    }
  };

  window.updateActiveSpell = (level, field, value) =>
    window.updateSpell(level, resolveIndex(toLevel(level)), field, value);
  window.deleteActiveSpell = level =>
    window.removeSpell(level, resolveIndex(toLevel(level)));

  window.refreshSpellSystem = function () {
    normalizeSpells();
    for (let l = 0; l <= MAX_SPELL_LEVEL; l++) {
      const detail = $('spell-detail-' + l);
      if (detail) { detail.innerHTML = ''; delete detail.dataset.spellIndex; }
      renderSpellList(l);
    }
    switchSpellTab(window.activeSpellTab);
    switchSlotSet(window.activeSlotSet);
  };

  /* ==========================================================================
     5. CÁLCULOS DE MAGIA E ESPAÇOS (SLOTS)
     ========================================================================== */
  window.updateSpellDC = function () {
    const ability = $('spell-ability')?.value;
    const dcEl = $('spell-dc');
    const atkEl = $('spell-atk');

    const canCalc = ability
      && typeof getMod === 'function' && typeof getAttrVal === 'function'
      && typeof getProfBonus === 'function' && typeof fmtMod === 'function';

    if (!canCalc) {
      if (!ability) {
        if (!window.spellDCOverride && dcEl) dcEl.value = '';
        if (!window.spellAtkOverride && atkEl) atkEl.value = '';
      }
      return;
    }

    const mod = getMod(getAttrVal(ability));
    const pb = getProfBonus();

    if (!window.spellDCOverride && dcEl) dcEl.value = 8 + mod + pb;
    if (!window.spellAtkOverride && atkEl) atkEl.value = fmtMod(mod + pb);
  };

  function slotStore(setName) {
    const key = setName === 'secondary' ? 'secondarySpellSlots' : 'spellSlots';
    if (!window[key] || typeof window[key] !== 'object') window[key] = {};
    return window[key];
  }

  function getSlotData(level) {
    const store = slotStore(window.activeSlotSet);
    let s = store[level];
    if (!s || typeof s !== 'object') s = store[level] = { total: 0, used: 0 };
    s.total = clamp(toInt(s.total), 0, MAX_SLOTS);
    s.used = clamp(toInt(s.used), 0, s.total);
    return s;
  }

  window.switchSlotSet = function (setName) {
    window.activeSlotSet = setName === 'secondary' ? 'secondary' : 'primary';
    const isPrimary = window.activeSlotSet === 'primary';

    $('btn-slot-primary')?.classList.toggle('active', isPrimary);$('btn-slot-secondary')?.classList.toggle('active', !isPrimary);

    const label = $('slot-set-indicator');
    if (label) label.textContent = isPrimary ? 'Grade: Principal' : 'Grade: Secundária';

    buildSlotOverview();
  };

  window.buildSlotOverview = function () {
    const grid = $('slots-grid');
    if (!grid) return;

    let html = '';
    for (let l = 1; l <= MAX_SPELL_LEVEL; l++) {
      const s = getSlotData(l);
      html += `
        <div class="slot-block">
            <input type="number" id="slot-ov-${l}" class="sl-num-input" min="0" max="${MAX_SLOTS}" value="${s.total}"
                aria-label="Total de espaços de nível ${l}"
                oninput="setSlotTotal(${l}, this.value, true)" onchange="setSlotTotal(${l}, this.value)">
            <div class="sl-num">Nível ${l}</div>
            <div class="sl-pips" id="sl-pips-${l}"></div>
        </div>`;
    }
    grid.innerHTML = html;

    for (let l = 1; l <= MAX_SPELL_LEVEL; l++) updateSlotPips(l);
  };

  window.setSlotTotal = function (level, val, keepInput) {
    level = clamp(toInt(level), 1, MAX_SPELL_LEVEL);
    const n = clamp(toInt(val), 0, MAX_SLOTS);
    const s = getSlotData(level);
    s.total = n;
    s.used = Math.min(s.used, n);

    const input = $('slot-ov-' + level);
    if (input && !keepInput) input.value = n;

    updateSlotPips(level);
  };

  window.toggleSlotPip = function (level, i) {
    const s = getSlotData(level);
    if (i < s.used) s.used--;
    else if (s.used < s.total) s.used++;
    updateSlotPips(level);
  };

  window.updateSlotPips = function (level) {
    const el = $('sl-pips-' + level);
    if (!el) return;

    const s = getSlotData(level);

    while (el.children.length > s.total) el.lastElementChild.remove();
    while (el.children.length < s.total) {
      const i = el.children.length;
      const pip = document.createElement('div');
      pip.onclick = () => window.toggleSlotPip(level, i);
      el.appendChild(pip);
    }
    Array.from(el.children).forEach((pip, i) => {
      const isUsed = i < s.used;
      pip.className = 'sl-pip ' + (isUsed ? 'used' : 'avail');
      pip.title = isUsed ? 'Gasto (clique para recuperar)' : 'Disponível (clique para gastar)';
    });
  };

  /* ==========================================================================
     INICIALIZAÇÃO
     ========================================================================== */
  let initialized = false;

  function initSpellSystem() {
    if (initialized) return;
    initialized = true;

    ensureSpellStyles();
    normalizeSpells();
    buildSpellTabs();
    switchSpellTab(window.activeSpellTab);
    switchSlotSet(window.activeSlotSet);
  }

  if (document.readyState === 'complete') {
    initSpellSystem();
  } else {
    document.addEventListener('DOMContentLoaded', initSpellSystem, { once: true });
    window.addEventListener('load', initSpellSystem, { once: true });
  }
})();
