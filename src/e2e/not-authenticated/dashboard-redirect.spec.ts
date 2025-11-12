import { test, expect } from "@playwright/test";

test.describe("dashboard redirect", () => {
  test("should not be accessible for used that is not logged in", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    expect(page.url()).toContain("/sign-in");
  });
});
