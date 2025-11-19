import fs from "node:fs/promises";
import path from "node:path";
import { Browser } from "@playwright/test";

export type CreateBrowserContextOptions = {
  baseURL?: string;
  colorScheme?: "light" | "dark" | "no-preference";
  localStorage?: Array<{ name: string; value: string }>;
  authenticated?: boolean;
};

export const createBrowserContext = async (
  browser: Browser,
  options: CreateBrowserContextOptions = {}
) => {
  let storageState: any = {
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
    const storageStateAuth = JSON.parse(await fs.readFile(authFile, "utf-8"));
    storageState.cookies = storageStateAuth.cookies;
  }

  return browser.newContext({
    colorScheme: options.colorScheme ?? "no-preference",
    storageState,
  });
};
