import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test/e2e",
  use: {
    baseURL: "http://127.0.0.1:4174",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm build && pnpm exec vite --host 127.0.0.1 --port 4174",
    port: 4174,
    reuseExistingServer: !process.env.CI,
  },
});
