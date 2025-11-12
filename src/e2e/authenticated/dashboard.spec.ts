import { test, expect } from "../fixtures/authenticated";
import { a11y, checkAppliedTheme } from "../utils";

test.describe("dashboard authenticated flow", () => {
  test("should be able to access dashboard, sign out and be redirected to sign-in page", async ({
    authenticatedContext,
  }) => {
    const { context } = authenticatedContext;
    const page = await context.newPage();
    await page.goto("/dashboard");

    await page.getByTestId("user-button").click();
    await page.getByTestId("sign-out-button").click();

    await page.waitForURL("**/sign-in");
    expect(page.url()).toContain("/sign-in");
  });

  test("should display correct dark theme without a11y violations", async ({
    authenticatedContext,
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    await context.addCookies(await authenticatedContext.context.cookies());
    const page = await context.newPage();

    await page.goto("/dashboard");
    await checkAppliedTheme(page, "dark");
    await a11y({ page });

    await context.close();
  });

  test("should display correct light theme without a11y violations", async ({
    authenticatedContext,
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    await context.addCookies(await authenticatedContext.context.cookies());
    const page = await context.newPage();

    await page.goto("/dashboard");
    await checkAppliedTheme(page, "light");
    await a11y({ page });

    await context.close();
  });
});
