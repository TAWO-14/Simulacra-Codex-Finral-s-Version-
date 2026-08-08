let feats = [];

function renderFeats() {
    const list = document.getElementById('feats-list');
    if (!list) return;
    list.innerHTML = '';

    feats.forEach((f, i) => {
        const block = document.createElement('div');
        block.className = 'feat-block' + (f.open ? ' open' : '');

        block.innerHTML = `
      <div class="feat-header" onclick="toggleFeat(${i})">
        <input class="feat-name-input"
          type="text"
          value="${escapeHTML(f.name)}"
          placeholder="Nome do talento..."
          onclick="event.stopPropagation()"
          oninput="feats[${i}].name=this.value">

        <span class="feat-toggle">▾</span>

        <button
          type="button"
          class="rn-toggle"
          onclick="event.stopPropagation(); toggleRN('feat-desc-${i}', this)"
          title="Alternar pré-visualização">
          👁
        </button>

        <span class="feat-del"
          onclick="event.stopPropagation(); removeFeat(${i})"
          title="Remover">
          ×
        </span>
      </div>

      <div class="feat-body">
        <div class="rn-wrap">
          <textarea
            id="feat-desc-${i}"
            rows="3"
            placeholder="Descrição, efeitos, pré-requisitos..."
            oninput="feats[${i}].desc=this.value"
            style="min-height:50px;">${escapeHTML(f.desc || '')}</textarea>

         <div
            class="rn-preview"
            id="rn-feat-desc-${i}"
            ondblclick="editRN('feat-desc-${i}',this)">
          </div>
        </div>
      </div>
    `;

        list.appendChild(block);
    });
}

function addFeat() {
    feats.push({ name: '', desc: '', open: true });
    renderFeats();
    const list = document.getElementById('feats-list');
    if (list) list.lastElementChild?.querySelector('.feat-name-input')?.focus();
}

function removeFeat(i) {
    feats.splice(i, 1);
    renderFeats();
}

function toggleFeat(i) {
    feats[i].open = !feats[i].open;
    renderFeats();
}

let fichaAlterada = false;
document.addEventListener('input', () => { fichaAlterada = true; }, true);
const exportBtnEl = document.getElementById('export-btn');
if (exportBtnEl) exportBtnEl.addEventListener('click', () => { fichaAlterada = false; });
window.addEventListener('beforeunload', (e) => {
    if (!fichaAlterada) return;
    e.preventDefault();
    e.returnValue = '';
});