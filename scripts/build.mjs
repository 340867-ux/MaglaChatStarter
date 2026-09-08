import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dist = path.join(root, "dist");
const sourceFiles = [
  "core.js", "storage.js", "content.js", "content.css",
  "popup.html", "popup.css", "popup.js",
  "options.html", "options.css", "options.js"
];

fs.rmSync(dist, { recursive: true, force: true });
for (const target of ["chrome", "firefox"]) {
  const out = path.join(dist, target);
  fs.mkdirSync(out, { recursive: true });
  for (const file of sourceFiles) fs.copyFileSync(path.join(root, "src", file), path.join(out, file));
  fs.copyFileSync(path.join(root, `manifest.${target}.json`), path.join(out, "manifest.json"));
  fs.copyFileSync(path.join(root, "PRIVACY.md"), path.join(out, "PRIVACY.md"));
  const zip = path.join(dist, `MAGLA-Chat-Starter-${target}-v0.1.0.zip`);
  execFileSync("zip", ["-qr", zip, "."], { cwd: out });
}
console.log("Built:", fs.readdirSync(dist).sort());
