import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "@shamrock-design/tokens/css/core.css";
import "@shamrock-design/tokens/css/theme-clover.css";
import "@shamrock-design/tokens/css/theme-violet.css";
import "@shamrock-design/ui/styles.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        neutral: "neutral",
        clover: "clover",
        violet: "violet",
      },
      defaultTheme: "neutral",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
