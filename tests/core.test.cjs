const assert = require("node:assert/strict");
const Core = require("../src/core.js");

const config = Core.normalizeConfig({
  phrase: "Старт",
  plugins: "A\nB",
  template: "{{phrase}}\n\nИнструменты:\n{{plugins}}"
});
assert.equal(Core.buildMessage(config), "Старт\n\nИнструменты:\nA\nB");
assert.equal(Core.providerFromUrl("https://chatgpt.com/"), "chatgpt");
assert.equal(Core.providerFromUrl("https://claude.ai/new"), "claude");
assert.equal(Core.providerFromUrl("https://gemini.google.com/app"), "gemini");
assert.equal(Core.providerFromUrl("https://example.com/"), "other");
assert.equal(Core.isSupportedUrl("https://chatgpt.com/c/abc"), true);
assert.equal(Core.isSupportedUrl("https://example.com/"), false);
assert.equal(Core.buildMessage({ phrase: "Только фраза", plugins: "", template: "{{phrase}}\n\n{{plugins}}" }), "Только фраза");
assert.ok(Core.buildMessage({ phrase: "x" }).length > 0);
console.log("PASS starter core tests", { version: Core.VERSION });
