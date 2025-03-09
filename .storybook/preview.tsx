import React from "react";
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";

import { initialize, mswLoader } from "msw-storybook-addon";

initialize({
  serviceWorker: {
    url: "./apiMockServiceWorker.js",
  },
});

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
    (Story) => (
      <div id="sb-test-wrapper">
        <Story />
      </div>
    ),
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
  ],
  loaders: [mswLoader],
};

export default preview;
