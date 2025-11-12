import { expect, test } from "@playwright/test";

test.describe("Notes page (authenticated)", () => {
  test("should display the notes page", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /my notes/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /create note/i }),
    ).toBeVisible();
  });

  test("should be able to create a new note with sample text content", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /create note/i }).click();

    const testTitle = `Test Note ${Date.now()}`;
    await page.getByLabel(/title/i).fill(testTitle);

    await page.getByRole("paragraph").filter({ hasText: /^$/ }).click();

    await page.locator(".tiptap").fill("This is a test note content");

    // Wait for the content to be processed by the editor (debounce is 500ms)
    await page.waitForTimeout(700);

    const formErrors = page.locator(".FormMessage");
    expect(await formErrors.count()).toBe(0);

    await page.getByRole("button", { name: /save/i }).click();

    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Note created successfully!")).toBeVisible();

    await expect(page.getByText(testTitle)).toBeVisible();
  });
});
