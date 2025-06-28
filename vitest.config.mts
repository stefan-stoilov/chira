import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        envPrefix: ["NEXT_PUBLIC"],
        test: {
          name: "FE",
          environment: "jsdom",
          setupFiles: "./src/tests/setup-tests.ts",
          exclude: ["node_modules", "**/e2e/**", "**/server/**"],
        },
      },
      {
        extends: true,
        test: {
          name: "BE",
          environment: "edge-runtime",
          include: ["src/server/**/**.test.ts"],
          env: loadEnv("test", process.cwd(), ""),
        },
      },
    ],
  },
});
