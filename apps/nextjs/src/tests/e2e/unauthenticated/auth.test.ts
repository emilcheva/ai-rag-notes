import { expect, test } from "@playwright/test";

test.describe("Authentication flow", () => {
  test("should redirect to sign-in page when accessing protected route", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/.*sign-in/);
  });

  test("should display sign-in form", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign In", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign in with google/i }),
    ).toBeVisible();
  });

  test("should display sign-up form", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    const passwordInputs = page.locator("input[type='password']");
    await expect(passwordInputs).toHaveCount(2);
    await expect(
      page.getByRole("button", { name: "Sign Up", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign up with google/i }),
    ).toBeVisible();
  });
});
