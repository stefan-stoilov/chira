import { test, expect } from "@playwright/test";

test("Homepage is accessible and has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/chira/i);
});

test("Sign up page is accessible", async ({ page }) => {
  await page.goto("/sign-up");
});

test("Sign in page is accessible", async ({ page }) => {
  await page.goto("/sign-in");
});

test("Dashboard is not accessible", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForURL("sign-in");
});
