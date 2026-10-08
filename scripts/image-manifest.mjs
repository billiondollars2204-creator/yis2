// Scans public/images and writes src/data/image-manifest.json, mapping each
// extension-less path stem to the actual file. Components use it to decide
// whether to render a real image or a neutral placeholder.
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const publicDir = join(process.cwd(), "public");
const exts = [".avif", ".webp", ".jpg", ".jpeg", ".png"]; // preference order
const found = {};

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    const ext = extname(name).toLowerCase();
    if (!exts.includes(ext)) continue;
    const url = "/" + relative(publicDir, full).split(sep).join("/");
    const stem = url.slice(0, -ext.length);
    const prev = found[stem];
    if (!prev || exts.indexOf(ext) < exts.indexOf(extname(prev).toLowerCase())) found[stem] = url;
  }
}

walk(join(publicDir, "images"));
const sorted = Object.fromEntries(Object.entries(found).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(process.cwd(), "src/data/image-manifest.json"), JSON.stringify(sorted, null, 2) + "\n");
console.log(`image manifest: ${Object.keys(sorted).length} image(s) found`);
