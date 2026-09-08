(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MaglaChatStarterCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const VERSION = "0.1.0";
  const STORAGE_KEY = "maglaChatStarterConfig";
  const DEFAULT_TEMPLATE = "{{phrase}}\n\nПодключённые плагины и инструменты:\n{{plugins}}";
  const DEFAULT_CONFIG = {
    phrase: "Начинаем работу.",
    plugins: "",
    template: DEFAULT_TEMPLATE
  };

  function limit(value, max) {
    return String(value == null ? "" : value).slice(0, max);
  }

  function normalizeConfig(raw) {
    const value = raw && typeof raw === "object" ? raw : {};
    return {
      phrase: limit(value.phrase || DEFAULT_CONFIG.phrase, 500).trim(),
      plugins: limit(value.plugins || "", 10000).trim(),
      template: limit(value.template || DEFAULT_TEMPLATE, 12000).trim() || DEFAULT_TEMPLATE
    };
  }

  function compactBlankLines(text) {
    return String(text || "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function renderTemplate(template, values) {
    const source = String(template || DEFAULT_TEMPLATE);
    const data = values || {};
    return compactBlankLines(source
      .replace(/\{\{\s*phrase\s*\}\}/giu, String(data.phrase || ""))
      .replace(/\{\{\s*plugins\s*\}\}/giu, String(data.plugins || "")));
  }

  function buildMessage(raw) {
    const config = normalizeConfig(raw);
    return renderTemplate(config.template, config);
  }

  function providerFromUrl(url) {
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host === "chatgpt.com" || host.endsWith(".chatgpt.com") || host === "chat.openai.com") return "chatgpt";
      if (host === "claude.ai" || host.endsWith(".claude.ai")) return "claude";
      if (host === "gemini.google.com" || host.endsWith(".gemini.google.com")) return "gemini";
      return "other";
    } catch (_) {
      return "other";
    }
  }

  function isSupportedUrl(url) {
    return providerFromUrl(url) !== "other";
  }

  return {
    VERSION,
    STORAGE_KEY,
    DEFAULT_TEMPLATE,
    DEFAULT_CONFIG,
    normalizeConfig,
    renderTemplate,
    buildMessage,
    providerFromUrl,
    isSupportedUrl
  };
});
