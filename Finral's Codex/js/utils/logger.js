const Logger = {
  _getTime() {
    return new Date().toLocaleTimeString();
  },

  info(msg, data = '') {
    console.log(`ℹ️ INFO [${this._getTime()}]: ${msg}`, data);
  },

  warn(msg, data = '') {
    console.warn(`⚠️ WARN [${this._getTime()}]: ${msg}`, data);
  },

  error(msg, err = '') {
    console.error(`❌ ERROR [${this._getTime()}]: ${msg}`, err);
  },

  debug(msg, data = '') {
    console.log(`🔍 DEBUG [${this._getTime()}]: ${msg}`, data);
  }
};