/**
 * Theme contract check (ADR-0004): themes may ONLY override color.accent.* and
 * font.* tokens. Radius, glass, shadows, spacing, motion, status colors and
 * text/border roles are fixed canon. This makes the "themes swap color + fonts
 * only" decision CI-enforced rather than convention.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const themeDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "themes");

const ALLOWED = [/^color\.accent\./, /^font\./];

function tokenPaths(node, path = [], out = []) {
  if (node && typeof node === "object") {
    if ("$value" in node) {
      out.push(path.join("."));
      return out;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      tokenPaths(child, [...path, key], out);
    }
  }
  return out;
}

let failed = false;
for (const file of readdirSync(themeDir).filter((f) => f.endsWith(".json"))) {
  const tree = JSON.parse(readFileSync(join(themeDir, file), "utf8"));
  const violations = tokenPaths(tree).filter((p) => !ALLOWED.some((rule) => rule.test(p)));
  if (violations.length > 0) {
    failed = true;
    console.error(
      `✗ ${basename(file)} violates the theme contract (themes may only set color.accent.* / font.*):`,
    );
    for (const v of violations) console.error(`    ${v}`);
  } else {
    console.log(`✓ ${basename(file)} respects the theme contract`);
  }
}

if (failed) process.exit(1);
