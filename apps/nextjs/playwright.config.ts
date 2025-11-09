import { defineConfig } from "@playwright/test";

const CI = !!process.env.CI;
const baseURL = "http://localhost:3000";

export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: false,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  expect: { timeout: 5000 },
  projects: [
    { name: "setup", testMatch: "**/*.setup.ts", teardown: "teardown" },
    {
      name: "authenticated",
      testMatch: "authenticated/**/*.test.ts",
      use: {
        storageState: "./src/tests/e2e/.auth/auth.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "unauthenticated",
      testMatch: "unauthenticated/**/*.test.ts",
      dependencies: ["setup"],
    },
    { name: "teardown", testMatch: "**/*.teardown.ts" },
  ],
  webServer: {
    command: CI ? "pnpm start" : "pnpm dev",
    url: baseURL,
    reuseExistingServer: !CI,
  },
});
