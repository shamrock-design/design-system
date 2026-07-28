#!/usr/bin/env node
// create-shamrock-app — scaffold a new app on the Shamrock Design System.
//
//   npm create shamrock-app@latest my-app
//   pnpm create shamrock-app my-app --theme clover
//
// What it does, so the developer doesn't have to:
//   1. Authenticates to GitHub Packages using the GitHub CLI (`gh auth token`) —
//      no Personal Access Token to create by hand. Writes a git-ignored .npmrc.
//   2. Scaffolds a Vite + React + TypeScript app with the theme, fonts, and the
//      four @shamrock-design packages already wired.
//   3. Drops in ESLint + Stylelint guardrails that enforce the canon, and
//      CLAUDE.md / AGENTS.md / .cursorrules so an AI coding agent stays on-system.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES = path.join(__dirname, "..", "templates");
const THEMES = ["clover", "violet", "neutral"];
const DEFAULT_THEME = "clover";
const REGISTRY = "https://npm.pkg.github.com";
const SCOPE = "@shamrock-design";

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};
const paint = (s, code) => (stdout.isTTY ? `${code}${s}${c.reset}` : String(s));
const ok = (s) => console.log(`${paint("✔", c.green)} ${s}`);
const info = (s) => console.log(`${paint("›", c.cyan)} ${s}`);
const warn = (s) => console.log(`${paint("!", c.yellow)} ${s}`);

function parseArgs(argv) {
  const args = { dir: undefined, theme: undefined, install: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--install") args.install = true;
    else if (a === "--theme") args.theme = argv[++i];
    else if (a.startsWith("--theme=")) args.theme = a.slice("--theme=".length);
    else if (!a.startsWith("-") && args.dir === undefined) args.dir = a;
  }
  return args;
}

function printHelp() {
  console.log(`
${paint("create-shamrock-app", c.bold)} — scaffold an app on the Shamrock Design System

${paint("Usage", c.dim)}
  npm create shamrock-app@latest [dir] [options]
  pnpm create shamrock-app [dir] [options]

${paint("Options", c.dim)}
  --theme <name>   Brand theme: ${THEMES.join(" | ")}  (default: ${DEFAULT_THEME})
  --install        Run the install after scaffolding
  -h, --help       Show this help
`);
}

/** Read a GitHub token from the GitHub CLI, if it's installed and logged in. */
function ghToken() {
  try {
    return execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"], encoding: "utf8" }).trim() || null;
  } catch {
    return null;
  }
}

function writeNpmrc(dir) {
  const token = ghToken();
  const lines = [`${SCOPE}:registry=${REGISTRY}`];
  if (token) {
    lines.push(`//npm.pkg.github.com/:_authToken=${token}`);
  } else {
    lines.push(
      "# No GitHub token found. Install the GitHub CLI and run `gh auth login`,",
      "# then re-run this scaffolder — or paste a token (scope: read:packages) below.",
      "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN_WITH_read_packages",
    );
  }
  fs.writeFileSync(path.join(dir, ".npmrc"), lines.join("\n") + "\n");
  return Boolean(token);
}

/** Underscore-prefixed template files map back to their real (dot/reserved) names. */
function destName(name) {
  const special = {
    "_package.json": "package.json",
    "_gitignore": ".gitignore",
    "_cursorrules": ".cursorrules",
    "_stylelintrc.json": ".stylelintrc.json",
  };
  if (special[name]) return special[name];
  if (name.startsWith("_")) return "." + name.slice(1);
  return name;
}

function copyTemplates(srcDir, destDir, vars) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      const sub = path.join(destDir, entry.name);
      fs.mkdirSync(sub, { recursive: true });
      copyTemplates(src, sub, vars);
      continue;
    }
    let text = fs.readFileSync(src, "utf8");
    for (const [key, value] of Object.entries(vars)) {
      text = text.replaceAll(`{{${key}}}`, value);
    }
    fs.writeFileSync(path.join(destDir, destName(entry.name)), text);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return printHelp();

  console.log(`\n${paint("Shamrock Design System", c.bold)} — new app\n`);

  const interactive = stdin.isTTY && stdout.isTTY;
  const rl = interactive ? readline.createInterface({ input: stdin, output: stdout }) : null;
  const ask = async (q, def) => {
    if (!rl) return def;
    const a = (await rl.question(`${q} ${paint(`(${def})`, c.dim)} `)).trim();
    return a || def;
  };

  // Target directory.
  let dir = args.dir || (await ask("Project directory?", "my-shamrock-app"));
  dir = dir.trim();
  const dest = path.resolve(process.cwd(), dir);
  if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) {
    rl?.close();
    console.error(paint(`\n✖ ${dir} already exists and is not empty. Choose another name.\n`, c.red));
    process.exit(1);
  }

  // Theme.
  let theme = args.theme || (await ask(`Brand theme? ${paint(THEMES.join(" / "), c.dim)}`, DEFAULT_THEME));
  theme = String(theme).toLowerCase();
  if (!THEMES.includes(theme)) {
    warn(`Unknown theme "${theme}" — falling back to ${DEFAULT_THEME}. (Options: ${THEMES.join(", ")})`);
    theme = DEFAULT_THEME;
  }
  rl?.close();

  const appName = path.basename(dest);
  console.log();
  info(`Scaffolding ${paint(appName, c.bold)} with the ${paint(theme, c.bold)} theme…`);

  fs.mkdirSync(dest, { recursive: true });
  copyTemplates(TEMPLATES, dest, { APP_NAME: appName, THEME: theme });
  ok("Project files written (Vite + React + TS, theme + fonts wired).");
  ok("Guardrails in place (ESLint + Stylelint enforce the canon).");
  ok("AI rules dropped in (CLAUDE.md, AGENTS.md, .cursorrules).");

  const authed = writeNpmrc(dest);
  if (authed) ok("Authenticated to GitHub Packages via the GitHub CLI (.npmrc written, git-ignored).");
  else warn("No GitHub token found — .npmrc needs a token before install. See it for the one-line fix.");

  if (args.install) {
    try {
      info("Installing dependencies (pnpm install)…");
      execSync("pnpm install", { cwd: dest, stdio: "inherit" });
      ok("Dependencies installed.");
    } catch {
      warn("Install failed — run it yourself once the .npmrc token is set.");
    }
  }

  console.log(`\n${paint("Done.", c.green)} Next:\n`);
  console.log(`  ${paint(`cd ${dir}`, c.cyan)}`);
  if (!args.install) console.log(`  ${paint("pnpm install", c.cyan)}   ${paint("# or npm install", c.dim)}`);
  console.log(`  ${paint("pnpm dev", c.cyan)}\n`);
  if (!authed) {
    console.log(paint("  First set your GitHub Packages token:", c.yellow));
    console.log(`    ${paint("gh auth login", c.cyan)}   ${paint("# then re-run, or edit .npmrc by hand", c.dim)}\n`);
  }
  console.log(`${paint("The rules live in", c.dim)} CLAUDE.md ${paint("— your AI coding agent will read them automatically.", c.dim)}\n`);
}

main().catch((err) => {
  console.error(paint(`\n✖ ${err?.message || err}\n`, c.red));
  process.exit(1);
});
