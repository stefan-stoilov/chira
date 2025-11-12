import { test, expect } from "../fixtures/authenticated";
import { a11y, checkAppliedTheme } from "../utils";

test.describe("workspace creation flow", () => {
  test("should be able to create workspace and access all workspace routes then delete workspace without any a11y violations in light mode", async ({
    authenticatedContext,
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    await context.addCookies(await authenticatedContext.context.cookies());

    const page = await context.newPage();
    await page.goto("/dashboard");
    await checkAppliedTheme(page, "light");

    await page.getByRole("button", { name: "Create Workspace" }).click();
    await a11y({ page });

    await page.getByRole("textbox", { name: "Workspace Name" }).click();
    await page
      .getByRole("textbox", { name: "Workspace Name" })
      .fill("E2E workspace");
    await page.getByRole("button", { name: "Create Workspace" }).click();

    await page.getByRole("link", { name: "Members" }).click();
    await page.waitForURL("**/members");
    expect(page.url()).toContain("/members");
    await a11y({ page });

    await page.getByRole("link", { name: "Invites" }).click();
    await page.waitForURL("**/invites");
    expect(page.url()).toContain("/invites");
    await a11y({ page });

    await page.getByRole("link", { name: "Settings" }).click();
    await page.waitForURL("**/settings");
    expect(page.url()).toContain("/settings");
    await a11y({ page });

    await page.getByRole("button", { name: "Delete Workspace" }).click();
    await a11y({ page });

    await page.getByRole("button", { name: "Confirm" }).click();
    await page.waitForURL("**/dashboard");
  });

  test("should be able to create workspace and access all workspace routes then delete workspace without any a11y violations in dark mode", async ({
    authenticatedContext,
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    await context.addCookies(await authenticatedContext.context.cookies());

    const page = await context.newPage();
    await page.goto("/dashboard");
    await checkAppliedTheme(page, "dark");

    await page.getByRole("button", { name: "Create Workspace" }).click();
    await a11y({ page });

    await page.getByRole("textbox", { name: "Workspace Name" }).click();
    await page
      .getByRole("textbox", { name: "Workspace Name" })
      .fill("E2E workspace");
    await page.getByRole("button", { name: "Create Workspace" }).click();

    await page.getByRole("link", { name: "Members" }).click();
    await page.waitForURL("**/members");
    expect(page.url()).toContain("/members");
    await a11y({ page });

    await page.getByRole("link", { name: "Invites" }).click();
    await page.waitForURL("**/invites");
    expect(page.url()).toContain("/invites");
    await a11y({ page });

    await page.getByRole("link", { name: "Settings" }).click();
    await page.waitForURL("**/settings");
    expect(page.url()).toContain("/settings");
    await a11y({ page });

    await page.getByRole("button", { name: "Delete Workspace" }).click();
    await a11y({ page });

    await page.getByRole("button", { name: "Confirm" }).click();
    await page.waitForURL("**/dashboard");
  });
});
