(function() {
  try {
    const hash = globalThis.location.hash.slice(1);
    const params = {};
    hash.split('&').forEach(function(p) {
      const kv = p.split('=');
      if (kv[0]) { params[kv[0]] = decodeURIComponent(kv[1] || ''); }
    });
    let theme = params.theme;
    if (!theme) {
      const instanceId = params.id || 'default';
      theme = sessionStorage.getItem(instanceId + '-activeTheme');
    }
    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    }
  } catch (error) {
    if (globalThis.console && typeof globalThis.console.debug === 'function') {
      globalThis.console.debug('[WebViewer] Skipping dark prepaint bootstrap', error);
    }
  }
})();
