/**
 * =========================================
 * DEPENDENCY-LOADER.JS - Carregador de Dependências
 * =========================================
 * 
 * Valida e carrega bibliotecas externas (PDFLib, PDF.js, etc)
 * com fallback e tratamento de erro.
 */

const DependencyLoader = (() => {
  const DEPENDENCIES = {
    PDFLib: {
      name: 'PDFLib',
      globalKey: 'PDFLib',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
      fallback: 'https://pdf-lib.js.org/pdf-lib.min.js',
    },
    pdfjsLib: {
      name: 'PDF.js',
      globalKey: 'pdfjsLib',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      fallback: null,
    },
    Cropper: {
      name: 'Cropper.js',
      globalKey: 'Cropper',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js',
      fallback: null,
    },
  };

  const loadedLibs = {};
  const loadingPromises = {};

  /**
   * Verifica se biblioteca está carregada
   * @param {string} libKey - Chave da biblioteca
   * @returns {boolean}
   */
  const isLoaded = (libKey) => {
    const dep = DEPENDENCIES[libKey];
    if (!dep) return false;
    return typeof window[dep.globalKey] !== 'undefined';
  };

  /**
   * Carrega script do CDN
   * @private
   * @param {string} url - URL do script
   * @returns {Promise<void>}
   */
  const loadScriptFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        Logger.debug(`✓ Script carregado: ${url}`);
        resolve();
      };

      script.onerror = () => {
        Logger.warn(`✗ Falha ao carregar: ${url}`);
        reject(new Error(`Falha ao carregar: ${url}`));
      };

      document.head.appendChild(script);
    });
  };

  /**
   * Carrega uma biblioteca com retry e fallback
   * @param {string} libKey - Chave da biblioteca
   * @returns {Promise<boolean>} true se carregada com sucesso
   */
  const load = async (libKey) => {
    const dep = DEPENDENCIES[libKey];
    
    if (!dep) {
      Logger.error(`Dependência não encontrada: ${libKey}`);
      return false;
    }

    // Já carregada?
    if (isLoaded(libKey)) {
      Logger.debug(`${dep.name} já está carregada`);
      loadedLibs[libKey] = true;
      return true;
    }

    // Já está sendo carregada?
    if (loadingPromises[libKey]) {
      return loadingPromises[libKey];
    }

    // Iniciar carregamento
    loadingPromises[libKey] = (async () => {
      try {
        Logger.info(`Carregando ${dep.name}...`);

        // Tentar URL primária
        try {
          await loadScriptFromURL(dep.url);
        } catch (err) {
          Logger.warn(`Falha na URL primária, tentando fallback...`);

          // Se tem fallback, tentar
          if (dep.fallback) {
            await loadScriptFromURL(dep.fallback);
          } else {
            throw err;
          }
        }

        // Verificar se realmente carregou
        if (!isLoaded(libKey)) {
          throw new Error(`${dep.name} carregado mas não está disponível globalmente`);
        }

        loadedLibs[libKey] = true;
        Logger.info(`✓ ${dep.name} carregado com sucesso`);
        return true;

      } catch (err) {
        Logger.error(`Erro ao carregar ${dep.name}`, err);
        loadedLibs[libKey] = false;
        return false;
      } finally {
        delete loadingPromises[libKey];
      }
    })();

    return loadingPromises[libKey];
  };

  /**
   * Carrega múltiplas bibliotecas em paralelo
   * @param {string[]} libKeys - Array de chaves
   * @returns {Promise<Object>} { libKey: boolean }
   */
  const loadMultiple = async (libKeys) => {
    const results = {};
    const promises = libKeys.map(async (key) => {
      results[key] = await load(key);
    });

    await Promise.all(promises);
    return results;
  };

  /**
   * Obtém status de todas as dependências
   * @returns {Object} { libKey: { loaded, name, url } }
   */
  const getStatus = () => {
    const status = {};
    Object.entries(DEPENDENCIES).forEach(([key, dep]) => {
      status[key] = {
        name: dep.name,
        loaded: isLoaded(key),
        url: dep.url,
      };
    });
    return status;
  };

  /**
   * Garante que todas as libs essenciais estão carregadas
   * @returns {Promise<boolean>} true se todas essenciais estão ok
   */
  const ensureEssentials = async () => {
    const essentials = ['PDFLib', 'pdfjsLib'];
    const results = await loadMultiple(essentials);

    const allLoaded = Object.values(results).every(r => r === true);
    if (!allLoaded) {
      Logger.warn('Algumas bibliotecas essenciais falharam ao carregar');
    }

    return allLoaded;
  };

  /**
   * Precarrega libs opcionais em background (não bloqueia)
   */
  const preloadOptional = async () => {
    const optional = ['Cropper'];
    Promise.all(optional.map(key => load(key))).catch(err => {
      Logger.debug('Erro ao precarregar libs opcionais', err);
    });
  };

  return {
    isLoaded,
    load,
    loadMultiple,
    getStatus,
    ensureEssentials,
    preloadOptional,
  };
})();
