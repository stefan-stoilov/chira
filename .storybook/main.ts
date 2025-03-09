import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/{app,components,features}/**/*.stories.{ts,tsx}"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/blocks",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      strictMode: true,
    },
  },
  docs: {},
  staticDirs: ["../public"],
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  }),
};
export default config;
