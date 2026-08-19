/* ==========================================================================
   COMBAT SYSTEM & RESOURCES
   (Nota: Funções centrais como getMod, buildAttrs e o carregamento 
    inicial (DOMContentLoaded) residem no character-data.js)
   ========================================================================== */

// ── Vida e HP ──
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

// ── Combate e Salvaguardas Especiais ──
function toggleInspiration() {
  inspiration = !inspiration;
  document.getElementById('insp-box').className = 'insp-box' + (inspiration ? ' active' : '');
}

function toggleDS(type, n) {
  const arr = deathSaves[type];
  arr[n - 1] = !arr[n - 1];
  document.getElementById(`ds-${type}${n}`).classList.toggle('filled', arr[n - 1]);
}

// ── Ataques ──
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
    tr.innerHTML = `
      <td><input type="text" value="${escapeHTML(atk.name)}" placeholder="Arma/Magia" oninput="attacks[${i}].name=this.value"></td>
      <td style="width:80px;"><input type="text" value="${escapeHTML(atk.bonus)}" placeholder="+5" oninput="attacks[${i}].bonus=this.value"></td>
      <td><input type="text" value="${escapeHTML(atk.damage)}" placeholder="1d8+3 / Tipo" oninput="attacks[${i}].damage=this.value"></td>
      <td class="attack-row-del" onclick="removeAttack(${i})">×</td>
    `;
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
        <input class="lres-name" value="${escapeHTML(res.name)}" placeholder="Ex: Ki, Fúria, Inspiração..." oninput="if(limitedResources[${i}]) limitedResources[${i}].name=this.value">
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

// ── Controle de Abas (Navegação UI) ──
function switchTab(idx) {
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === idx));
  document.querySelectorAll('.page').forEach((p, i) => p.classList.toggle('active', i === idx));
}
