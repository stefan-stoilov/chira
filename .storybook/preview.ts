import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";

import { initialize, mswLoader } from "msw-storybook-addon";

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

import "@/styles/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  globalTypes: {
    darkMode: {
      defaultValue: true,
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  loaders: [mswLoader],
};

export default preview;
