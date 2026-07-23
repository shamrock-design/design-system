/**
 * Generates manifest.json — a typed index of every asset (path, category, size,
 * sha256) so apps and AI agents can discover assets programmatically instead of
 * copy-pasting files around.
 *
 * Also the CI quality gate for designer PRs: enforces kebab-case naming and
 * allowed extensions per category. With --check, validates + verifies the
 * committed manifest is up to date.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const CATEGORIES = {
  illustrations: [".svg"],
  lottie: [".json", ".lottie"],
  rive: [".riv"],
  gifs: [".gif"],
  raster: [".png", ".webp", ".jpg"],
};

const errors = [];
const entries = [];

for (const [category, extensions] of Object.entries(CATEGORIES)) {
  const dir = join(root, category);
  if (!existsSync(dir)) continue;
  const walk = (d) => {
    for (const item of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, item.name);
      if (item.isDirectory()) {
        walk(full);
        continue;
      }
      if (item.name === ".gitkeep") continue;
      const rel = relative(root, full);
      const ext = item.name.slice(item.name.lastIndexOf("."));
      if (!extensions.includes(ext)) {
        errors.push(`${rel}: extension ${ext} not allowed in ${category}/ (allowed: ${extensions.join(" ")})`);
        continue;
      }
      const base = item.name.slice(0, item.name.lastIndexOf("."));
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(base)) {
        errors.push(`${rel}: name must be kebab-case (category-subject-variant)`);
      }
      const buffer = readFileSync(full);
      entries.push({
        path: rel,
        category,
        bytes: statSync(full).size,
        sha256: createHash("sha256").update(buffer).digest("hex").slice(0, 16),
      });
    }
  };
  walk(dir);
}

if (errors.length > 0) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}

entries.sort((a, b) => a.path.localeCompare(b.path));
const manifest = JSON.stringify({ assets: entries }, null, 2) + "\n";
const manifestPath = join(root, "manifest.json");

if (checkOnly) {
  const current = existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : "";
  if (current !== manifest) {
    console.error("✗ manifest.json is stale — run `pnpm --filter @shamrock-design/assets build` and commit it");
    process.exit(1);
  }
  console.log(`✓ ${entries.length} assets valid, manifest up to date`);
} else {
  writeFileSync(manifestPath, manifest);
  writeFileSync(
    join(root, "manifest.d.ts"),
    `export interface ShamrockAsset {\n  path: string;\n  category: "illustrations" | "lottie" | "rive" | "gifs" | "raster";\n  bytes: number;\n  sha256: string;\n}\ndeclare const manifest: { assets: ShamrockAsset[] };\nexport default manifest;\n`,
  );
  console.log(`✓ manifest.json written (${entries.length} assets)`);
}
