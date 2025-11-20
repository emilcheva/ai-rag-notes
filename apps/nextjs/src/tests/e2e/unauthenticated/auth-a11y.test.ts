import { test } from "@playwright/test";

import { a11y } from "../a11y";
import { createBrowserContext } from "../utils";

test.describe("signin", () => {
  test("audits a11y issues in light mode", async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: "theme", value: "light" }],
    });

    const page = await context.newPage();

    await page.goto("/sign-in");

    await a11y({ page });
  });

  test("audits a11y issues in dark mode", async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: "theme", value: "dark" }],
    });

    const page = await context.newPage();
    await page.goto("/sign-in");

    await a11y({ page });
  });
});

test.describe("signup", () => {
  test("audits a11y issues in light mode", async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: "theme", value: "light" }],
    });

    const page = await context.newPage();

    await page.goto("/sign-up");

    await a11y({ page });
  });

  test("audits a11y issues in dark mode", async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: "theme", value: "dark" }],
    });

    const page = await context.newPage();
    await page.goto("/sign-up");

    await a11y({ page });
  });
});
