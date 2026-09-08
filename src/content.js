(function () {
  "use strict";
  const root = globalThis;
  const Core = root.MaglaChatStarterCore;
  const Storage = root.MaglaChatStarterStorage;
  if (!Core || !Storage || root.__MAGLA_CHAT_STARTER__) return;
  root.__MAGLA_CHAT_STARTER__ = true;

  let config = Core.DEFAULT_CONFIG;
  let actionButton = null;
  let toast = null;
  let refreshTimer = null;

  function visible(element) {
    if (!element) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function candidates() {
    const host = location.hostname.toLowerCase();
    if (host.includes("claude.ai")) {
      return [
        "[data-testid='chat-input']",
        "div[contenteditable='true']",
        "textarea"
      ];
    }
    if (host.includes("gemini.google.com")) {
      return [
        "rich-textarea [contenteditable='true']",
        "rich-textarea",
        "div[contenteditable='true']",
        "textarea"
      ];
    }
    return [
      "#prompt-textarea",
      "textarea[data-testid*='prompt']",
      "textarea",
      "[contenteditable='true'][data-lexical-editor='true']",
      "main [contenteditable='true']"
    ];
  }

  function findComposer() {
    for (const selector of candidates()) {
      for (const element of document.querySelectorAll(selector)) {
        if (visible(element)) return element;
      }
    }
    return null;
  }

  function composerText(element) {
    if (!element) return "";
    if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) return String(element.value || "").trim();
    return String(element.innerText || element.textContent || "").trim();
  }

  function setComposerText(element, text) {
    if (!element) return false;
    element.focus();
    if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
      const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
      if (descriptor && descriptor.set) descriptor.set.call(element, text); else element.value = text;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    let inserted = false;
    try { inserted = document.execCommand("insertText", false, text); } catch (_) {}
    if (!inserted) {
      element.textContent = text;
      try {
        element.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
      } catch (_) {
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    return true;
  }

  function showToast(message, isError) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "magla-starter-toast";
      document.documentElement.appendChild(toast);
    }
    toast.textContent = message;
    toast.dataset.error = isError ? "true" : "false";
    toast.classList.add("magla-starter-toast-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("magla-starter-toast-visible"), 2600);
  }

  function insertStart() {
    const composer = findComposer();
    if (!composer) {
      showToast("Поле сообщения пока не найдено.", true);
      return { ok: false, reason: "composer-not-found" };
    }
    if (composerText(composer)) {
      showToast("Поле уже заполнено — ничего не перезаписал.", true);
      return { ok: false, reason: "composer-not-empty" };
    }
    const message = Core.buildMessage(config);
    if (!message) {
      showToast("Сначала задай стартовый шаблон в настройках.", true);
      return { ok: false, reason: "empty-template" };
    }
    setComposerText(composer, message);
    showToast("Стартовое сообщение вставлено. Отправь его сам.", false);
    refreshButton();
    return { ok: true };
  }

  function removeButton() {
    if (actionButton) actionButton.remove();
    actionButton = null;
  }

  function refreshButton() {
    const composer = findComposer();
    if (!composer || composerText(composer)) {
      removeButton();
      return;
    }
    if (!actionButton) {
      actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.className = "magla-starter-button";
      actionButton.textContent = "MAGLA · старт";
      actionButton.title = "Вставить первое сообщение (не отправляет автоматически)";
      actionButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        insertStart();
      });
      document.documentElement.appendChild(actionButton);
    }
  }

  function scheduleRefresh() {
    if (refreshTimer) return;
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      refreshButton();
    }, 250);
  }

  async function init() {
    config = await Storage.getConfig();
    refreshButton();
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    document.addEventListener("input", scheduleRefresh, true);
    setInterval(refreshButton, 2000);
    const api = root.browser || root.chrome;
    if (api && api.runtime && api.runtime.onMessage) {
      api.runtime.onMessage.addListener((request, _sender, sendResponse) => {
        if (!request || request.type !== "MAGLA_INSERT_START") return;
        insertStart();
        sendResponse({ ok: true });
      });
    }
    if (api && api.storage && api.storage.onChanged) {
      api.storage.onChanged.addListener((changes) => {
        const change = changes[Core.STORAGE_KEY];
        if (change && change.newValue) config = Core.normalizeConfig(change.newValue);
      });
    }
  }

  init();
})();
