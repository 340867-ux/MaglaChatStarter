(function () {
  "use strict";
  const Core = globalThis.MaglaChatStarterCore;
  const Storage = globalThis.MaglaChatStarterStorage;
  const api = globalThis.browser || globalThis.chrome;
  const status = document.getElementById("status");
  const preview = document.getElementById("preview");

  function setStatus(text, error) {
    status.textContent = text;
    status.classList.toggle("error", Boolean(error));
  }

  async function render() {
    const config = await Storage.getConfig();
    preview.textContent = Core.buildMessage(config) || "Пустой шаблон";
  }

  async function activeTab() {
    const tabs = await api.tabs.query({ active: true, currentWindow: true });
    return tabs && tabs[0];
  }

  document.getElementById("insert").addEventListener("click", async () => {
    try {
      const tab = await activeTab();
      if (!tab || !tab.id || !Core.isSupportedUrl(tab.url || "")) {
        setStatus("Открой ChatGPT.", true);
        return;
      }
      await api.tabs.sendMessage(tab.id, { type: "MAGLA_INSERT_START" });
      setStatus("Готово: текст вставлен, отправь его сам.", false);
    } catch (_) {
      setStatus("Не нашёл поле чата. Обнови страницу и повтори.", true);
    }
  });

  document.getElementById("settings").addEventListener("click", () => {
    if (api.runtime && api.runtime.openOptionsPage) api.runtime.openOptionsPage();
    else api.tabs.create({ url: api.runtime.getURL("options.html") });
  });

  render();
})();
