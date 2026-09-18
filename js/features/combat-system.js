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
    
    // Mantemos a classe hp-dynamic-input sempre ativa!
    curEl.className = 'hp-dynamic-input hp-current' + status;
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

function handleDynamicHP(el) {
  let val = String(el.value).trim();
  let oldVal = parseInt(el.dataset.old) || 0;
  let max = parseInt(document.getElementById('hp-max')?.value) || 0;

  if (val.startsWith('+') || val.startsWith('-')) {
    let delta = parseInt(val) || 0;
    
    // Se for o HP atual, usamos a função changeHP existente para que 
    // os danos (-X) sejam descontados primeiro dos Pontos Temporários!
    if (el.id === 'hp-current') {
      el.value = oldVal; // Restaura o valor na tela para a função base ler
      changeHP(delta);
      return;
    } else {
      // Se for HP temporário, apenas soma ou subtrai
      el.value = Math.max(0, oldVal + delta);
    }
  } else {
    // Sem sinal de + ou - : substitui o valor diretamente
    el.value = Math.max(0, parseInt(val) || 0);
  }
  
  // Limita o HP Atual para não passar do HP Máximo
  if (el.id === 'hp-current') {
     el.value = Math.min(max, parseInt(el.value));
  }
  
  updateHPBar();
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
    // Calcula o valor ATUAL (Total - Gasto)
    const current = Math.max(0, safeTotal - (res.used || 0)); 

    let counterHTML = '';
    let barHTML = '';

    // Se o total for 20 ou mais, renderiza a barra sólida e o input
    if (safeTotal >= 20) {
      const pct = Math.max(0, Math.min(100, (current / safeTotal) * 100));

      // Input da esquerda agora usa lresSetCurrent e limpa o valor ao focar
// Input da esquerda corrigido para não duplicar o evento de Enter
      counterHTML = `<input type="text" class="lres-num-used" value="${current}" title="Atual: Digite um valor absoluto ou use + e -" onfocus="this.value=''" onblur="if(this.value==='') this.value='${current}'" onchange="lresSetCurrent(${i}, this.value)" onkeydown="if(event.key === 'Enter') { event.preventDefault(); this.blur(); }"><span class="lres-sep"> / </span>`;      
      barHTML = `
        <div class="lres-solid-bg">
          <div class="lres-solid-fill" style="width: ${pct}%;"></div>
        </div>
      `;
    }
    // Se for menor que 20, renderiza os quadradinhos normais (mas mostra o Atual)
    else {
      counterHTML = `<span class="lres-counter">${current}<span class="lres-sep"> / </span></span>`;

      const segsHTML = Array.from({ length: safeTotal }, (_, p) =>
        `<div class="lres-seg${p < res.used ? ' filled' : ''}" onclick="toggleLresSeg(${i},${p})" title="Usar até aqui"></div>`
      ).join('');

      barHTML = `<div class="lres-bar" id="lres-bar-${i}">${segsHTML}</div>`;
    }

    block.innerHTML = `
      <div class="lres-top">
        <input class="lres-name" value="${escapeHTML(res.name)}" placeholder="Ex: Ki, Fúria..." oninput="if(limitedResources[${i}]) limitedResources[${i}].name=this.value">
        ${counterHTML}
        <input type="number" class="lres-num" min="0" max="999" value="${safeTotal}" title="Máximo" onchange="lresSetTotal(${i},this.value)">
        <span class="lres-reset" onclick="lresReset(${i})" title="Restaurar todos">↺</span>
        <span class="lres-del" onclick="removeLimitedResource(${i})" title="Remover">×</span>
      </div>
      ${barHTML}
    `;
    container.appendChild(block);
  });
}

function toggleLresSeg(i, p) {
  const res = limitedResources[i];
  if (!res) return;
  res.used = (p + 1 === res.used) ? p : p + 1;
  renderLimitedResources();
}

function lresSetCurrent(i, val) {
  if (!limitedResources[i]) return;
  const safeTotal = limitedResources[i].total;
  
  // Quanto o jogador tem neste momento
  const oldCurrent = safeTotal - limitedResources[i].used;
  let newCurrent;

  val = String(val).trim();

  // Se digitar + ou -, faz a conta baseada no valor atual
  if (val.startsWith('+') || val.startsWith('-')) {
    newCurrent = oldCurrent + (parseInt(val) || 0);
  } else {
    // Se digitar só um número, define diretamente o valor
    newCurrent = parseInt(val) || 0;
  }
  
  // Impede que a vida/recurso passe do máximo ou fique negativo
  newCurrent = Math.max(0, Math.min(safeTotal, newCurrent));
  
  // Salva no banco de dados como "quantidade gasta" (Total - Atual = Gasto)
  limitedResources[i].used = safeTotal - newCurrent;
  renderLimitedResources();
}

function lresSetTotal(i, val) {
  if (!limitedResources[i]) return;
  const n = Math.max(0, Math.min(999, parseInt(val) || 0));
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