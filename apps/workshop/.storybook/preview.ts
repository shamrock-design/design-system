import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "@shamrock/tokens/css/core.css";
import "@shamrock/tokens/css/theme-clover.css";
import "@shamrock/tokens/css/theme-violet.css";
import "@shamrock/ui/styles.css";

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
