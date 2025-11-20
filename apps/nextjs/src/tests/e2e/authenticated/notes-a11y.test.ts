import { test } from "@playwright/test";

import { a11y } from "../a11y";
import { createBrowserContext } from "../utils";

test.describe("notes", () => {
  test("audits a11y issues in light mode", async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: "theme", value: "light" }],
      authenticated: true,
    });

    const page = await context.newPage();
    await page.goto("/");

    await a11y({ page });
  });

  test("audits a11y issues in dark mode", async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: "theme", value: "dark" }],
      authenticated: true,
    });

    const page = await context.newPage();
    await page.goto("/");

    await a11y({ page });
  });
});
