// @shamrock-design/stylelint-config
// Makes the Shamrock canon self-enforcing in CSS / CSS Modules — where most of a
// Shamrock app's styling actually lives.
//
// Consume it from an app's .stylelintrc.json:
//   { "extends": "@shamrock-design/stylelint-config" }
//
// The three things it guards:
//   1. No hex colors anywhere (color-no-hex).
//   2. Colors AND spacing must come from --sh-* tokens, not raw values
//      (declaration-strict-value over color/background/border-color/margin/padding/gap).
//   3. Radius is 0 — only the circle/pill tokens (and 50%) may round.

/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // 1. Never a hex. (Disable the standard "shorten #ffffff to #fff" rule — it
    //    reads as if it wants hex, and color-no-hex already bans hex outright.)
    "color-no-hex": true,
    "color-hex-length": null,

    // 2. Color & spacing must be tokens. Any listed property whose value isn't a
    //    var(--sh-…) (or an obviously-safe keyword / gradient) is flagged.
    "scale-unlimited/declaration-strict-value": [
      [
        "/color$/",
        "fill",
        "stroke",
        "background",
        "background-color",
        "background-image",
        "margin",
        "/^margin-/",
        "padding",
        "/^padding-/",
        "gap",
        "row-gap",
        "column-gap",
      ],
      {
        ignoreValues: [
          "/^var\\(--sh-/",
          "transparent",
          "currentColor",
          "inherit",
          "initial",
          "unset",
          "revert",
          "none",
          "auto",
          "0",
          "/gradient/",
        ],
        disableFix: true,
        message:
          "Shamrock is token-only: use a --sh-* token here (e.g. var(--sh-color-text-primary), var(--sh-space-4)) — no raw values.",
      },
    ],

    // 3. Radius is 0. Sharp corners everywhere; only dots (circle) and count pills
    //    (pill) — or a literal 50% — may round.
    "declaration-property-value-allowed-list": {
      "border-radius": ["0", "/^var\\(--sh-radius-/", "50%"],
      "/^border(-\\w+)?-radius$/": ["0", "/^var\\(--sh-radius-/", "50%"],
    },

    // Relax standard rules that fight CSS-Modules and design-token authoring.
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "declaration-empty-line-before": null,
    "alpha-value-notation": null,
    "color-function-notation": null,
  },
};
