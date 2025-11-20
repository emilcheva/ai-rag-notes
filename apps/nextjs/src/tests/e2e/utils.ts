import fs from "node:fs/promises";
import path from "node:path";
import type { Browser } from "@playwright/test";

export interface CreateBrowserContextOptions {
  baseURL?: string;
  colorScheme?: "light" | "dark" | "no-preference";
  localStorage?: { name: string; value: string }[];
  authenticated?: boolean;
}

export const createBrowserContext = async (
  browser: Browser,
  options: CreateBrowserContextOptions = {},
) => {
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: options.baseURL ?? "http://localhost:3000",
        localStorage: options.localStorage ?? [],
      },
    ],
  };

  if (options.authenticated) {
    const authDir = path.join(process.cwd(), "src", "tests", "e2e", ".auth");
    const authFile = path.join(authDir, "auth.json");
    storageState.cookies = JSON.parse(
      await fs.readFile(authFile, "utf-8"),
    ).cookies;
  }

  return browser.newContext({
    colorScheme: options.colorScheme ?? "no-preference",
    storageState,
  });
};
