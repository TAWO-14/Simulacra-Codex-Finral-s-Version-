async function ensureLibrariesLoaded() {
  const libs = [
    { name: 'PDFLib', url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js' },
    { name: 'pdfjsLib', url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js' },
  ];

  for (const lib of libs) {
    if (!window[lib.name]) {
      Logger.warn(`${lib.name} não carregado, tentando recarregar...`);
      await loadScript(lib.url);
    }
  }
}

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falha ao carregar: ${url}`));
    document.head.appendChild(script);
  });
}