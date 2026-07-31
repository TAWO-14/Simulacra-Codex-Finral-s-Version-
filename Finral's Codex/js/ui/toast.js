// js/ui/toast.js
const Toast = {
  show(message, duration = 2500) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = message;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
  },

  success(msg) {
    this.show(`✔ ${msg}`);
  },

  error(msg) {
    this.show(`❌ ${msg}`);
  }
};

// Mantém compatibilidade caso algum código antigo chame showToast direto
function showToast(msg) {
  Toast.show(msg);
}