(function (root) {
  "use strict";
  const Core = root.MaglaChatStarterCore;
  const api = root.browser || root.chrome || null;

  function getConfig() {
    if (!api || !api.storage || !api.storage.local) return Promise.resolve(Core.DEFAULT_CONFIG);
    return new Promise((resolve) => {
      try {
        api.storage.local.get(Core.STORAGE_KEY, (value) => {
          const error = api.runtime && api.runtime.lastError;
          if (error) return resolve(Core.DEFAULT_CONFIG);
          resolve(Core.normalizeConfig(value && value[Core.STORAGE_KEY]));
        });
      } catch (_) {
        resolve(Core.DEFAULT_CONFIG);
      }
    });
  }

  function setConfig(config) {
    const normalized = Core.normalizeConfig(config);
    if (!api || !api.storage || !api.storage.local) return Promise.resolve(normalized);
    return new Promise((resolve) => {
      try {
        api.storage.local.set({ [Core.STORAGE_KEY]: normalized }, () => resolve(normalized));
      } catch (_) {
        resolve(normalized);
      }
    });
  }

  root.MaglaChatStarterStorage = { getConfig, setConfig };
})(typeof globalThis !== "undefined" ? globalThis : this);
