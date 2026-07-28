// @shamrock-design/eslint-config
// A flat ESLint config that makes the Shamrock canon self-enforcing in app code:
// hardcoded hex colors error, magic px warn — on top of a React + TypeScript baseline.
//
// Consume it from an app's eslint.config.js:
//   import shamrock from "@shamrock-design/eslint-config";
//   export default shamrock;
//
// The design system is token-driven and colorless: components reference only
// `--sh-*` semantic tokens, never a raw hex or a magic pixel. These rules catch
// the two violations that slip past code review most often, in the editor, for
// humans and AI agents alike. Anything genuinely intentional can be silenced with
// an inline `// eslint-disable-next-line` — the rule is a nudge, not a cage.

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
const PX = /\b\d*\.?\d+px\b/;

/** The Shamrock canon plugin: two string-scanning rules over .ts/.tsx literals. */
const canon = {
  meta: { name: "shamrock-canon", version: "0.1.0" },
  rules: {
    "no-hex-colors": {
      meta: {
        type: "problem",
        docs: { description: "Ban hardcoded hex colors — use a --sh-color-* / --sh-surface-* token." },
        messages: {
          hex: "Hardcoded hex color '{{value}}'. Shamrock is colorless: use a --sh-color-* / --sh-surface-* token via var(--sh-…).",
        },
        schema: [],
      },
      create(context) {
        const scan = (node, raw) => {
          if (typeof raw !== "string") return;
          const m = raw.match(HEX);
          if (m) context.report({ node, messageId: "hex", data: { value: m[0] } });
        };
        return {
          Literal(node) {
            if (typeof node.value === "string") scan(node, node.value);
          },
          TemplateElement(node) {
            scan(node, node.value.cooked ?? node.value.raw);
          },
        };
      },
    },
    "no-raw-px": {
      meta: {
        type: "suggestion",
        docs: { description: "Avoid magic px in inline styles — use --sh-space-* tokens or Stack/Inline/Grid gaps." },
        messages: {
          px: "Magic pixel value '{{value}}' in an inline style. Use a --sh-space-* token, a Stack/Inline/Grid gap, or a component prop.",
        },
        schema: [],
      },
      create(context) {
        // Only flag px inside a `style={{…}}` attribute — that's the real magic-px
        // smell. Component length props (e.g. Grid's minChildWidth="240px") are a
        // legitimate token-mapped API and must not be flagged; CSS files are Stylelint's job.
        const inStyleAttribute = (node) => {
          for (let cur = node.parent; cur; cur = cur.parent) {
            if (cur.type === "JSXAttribute") {
              return cur.name?.type === "JSXIdentifier" && cur.name.name === "style";
            }
          }
          return false;
        };
        const scan = (node, raw) => {
          if (typeof raw !== "string") return;
          const m = raw.match(PX);
          if (m && inStyleAttribute(node)) context.report({ node, messageId: "px", data: { value: m[0] } });
        };
        return {
          Literal(node) {
            if (typeof node.value === "string") scan(node, node.value);
          },
          TemplateElement(node) {
            scan(node, node.value.cooked ?? node.value.raw);
          },
        };
      },
    },
  },
};

/** @type {import("eslint").Linter.Config[]} */
export default [
  { ignores: ["dist/**", "build/**", "node_modules/**", "storybook-static/**", "coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { react, "react-hooks": reactHooks, shamrock: canon },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      // React 17+ automatic runtime — no need to import React into scope.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // The canon.
      "shamrock/no-hex-colors": "error",
      "shamrock/no-raw-px": "warn",
    },
  },
];
