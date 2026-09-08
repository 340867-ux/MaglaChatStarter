import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const required = ["core.js", "storage.js", "content.js", "content.css", "popup.html", "popup.js", "options.html", "options.js"];
const manifests = ["manifest.chrome.json", "manifest.firefox.json"];

for (const name of required) {
  if (!fs.existsSync(path.join(root, "src", name))) throw new Error(`missing src/${name}`);
}
for (const name of manifests) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
  if (manifest.manifest_version !== 3) throw new Error(`${name}: expected MV3`);
  if (!manifest.permissions.includes("storage")) throw new Error(`${name}: storage permission missing`);
  if (manifest.host_permissions.some((value) => !value.startsWith("https://"))) throw new Error(`${name}: non-HTTPS host`);
  if (JSON.stringify(manifest).includes("http://")) throw new Error(`${name}: insecure URL`);
  if (manifest.host_permissions.length !== 2) throw new Error(`${name}: unexpected host scope`);
}
for (const file of ["src/content.js", "src/core.js", "src/options.js", "src/popup.js", "src/storage.js"]) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  if (/fetch\s*\(|XMLHttpRequest|WebSocket|navigator\.sendBeacon/.test(text)) throw new Error(`${file}: network code found`);
}
console.log("PASS starter manifest/privacy validation");
