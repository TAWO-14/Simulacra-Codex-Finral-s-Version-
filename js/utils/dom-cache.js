const DOM = {
  // Guardador de elementos na memória
  _cache: new Map(),

  // Busca um elemento e guarda no cache
  get(selector) {
    if (!this._cache.has(selector)) {
      const element = document.querySelector(selector);
      if (element) {
        this._cache.set(selector, element);
      } else {
        Logger.warn(`Elemento não encontrado no HTML: ${selector}`);
        return null;
      }
    }
    return this._cache.get(selector);
  },

  // Busca vários elementos (ex: todas as inputs)
  getAll(selector) {
    return document.querySelectorAll(selector);
  },

  // Define um valor em um campo facilmente
  setValue(selector, value) {
    const el = this.get(selector);
    if (el) el.value = value;
  },

  // Facilita escutar eventos (ex: clique)
  on(selector, event, callback) {
    const el = this.get(selector);
    if (el) el.addEventListener(event, callback);
  }
};