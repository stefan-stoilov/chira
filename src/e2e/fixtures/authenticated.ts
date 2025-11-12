import {
  test as base,
  type Page,
  type BrowserContext,
  type Cookie,
} from "@playwright/test";
import {
  createTestUser,
  cleanupTestUser,
  createBrowserContext,
  checkAppliedTheme,
  checkStoredTheme,
} from "../utils";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "@/server/routes/auth/auth.constants";

type AuthFixture = {
  authenticatedContext: {
    context: BrowserContext;
    userId: string;
    checkAppliedTheme: (page: Page, theme: string) => Promise<void>;
    checkStoredTheme: (page: Page, expectedTheme: string) => Promise<void>;
  };
};

export const test = base.extend<AuthFixture>({
  authenticatedContext: async ({ browser, baseURL }, use) => {
    if (!baseURL) {
      throw new Error("baseURL is required for authenticatedContext fixture");
    }

    const { user, tokens } = await createTestUser();
    const context = await createBrowserContext(browser, {
      baseURL,
      colorScheme: "no-preference",
    });

    const url = new URL(baseURL);
    const domain = url.hostname;
    const secure = url.protocol === "https:";

    const cookies: Cookie[] = [
      {
        name: ACCESS_TOKEN,
        value: tokens.accessToken,
        domain,
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        secure,
        expires: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
      },
      {
        name: REFRESH_TOKEN,
        value: tokens.refreshToken,
        domain,
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        secure,
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
      },
    ];

    await context.addCookies(cookies);

    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await use({
        context,
        userId: user.id,
        checkAppliedTheme,
        checkStoredTheme,
      });
    } finally {
      await context.close();
      await cleanupTestUser({ id: user.id });
    }
  },
});

export { expect } from "@playwright/test";
