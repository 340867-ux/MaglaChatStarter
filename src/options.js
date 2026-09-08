(function () {
  "use strict";
  const Core = globalThis.MaglaChatStarterCore;
  const Storage = globalThis.MaglaChatStarterStorage;
  const fields = {
    phrase: document.getElementById("phrase"),
    plugins: document.getElementById("plugins"),
    template: document.getElementById("template")
  };
  const preview = document.getElementById("preview");
  const status = document.getElementById("status");

  function readForm() {
    return Core.normalizeConfig({
      phrase: fields.phrase.value,
      plugins: fields.plugins.value,
      template: fields.template.value
    });
  }

  function renderPreview() {
    preview.textContent = Core.buildMessage(readForm());
  }

  async function load() {
    const config = await Storage.getConfig();
    fields.phrase.value = config.phrase;
    fields.plugins.value = config.plugins;
    fields.template.value = config.template;
    renderPreview();
  }

  Object.values(fields).forEach((field) => field.addEventListener("input", renderPreview));
  document.getElementById("save").addEventListener("click", async () => {
    await Storage.setConfig(readForm());
    status.textContent = "Сохранено локально.";
    setTimeout(() => { status.textContent = ""; }, 2200);
  });
  document.getElementById("reset").addEventListener("click", () => {
    fields.phrase.value = Core.DEFAULT_CONFIG.phrase;
    fields.plugins.value = Core.DEFAULT_CONFIG.plugins;
    fields.template.value = Core.DEFAULT_CONFIG.template;
    renderPreview();
  });
  load();
})();
