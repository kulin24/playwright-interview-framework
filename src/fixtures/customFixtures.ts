import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/ui/LoginPage';
import { ApiClient } from '../pages/api/ApiClient';
import path from 'path';
import fs from 'fs';

type MyFixtures = {
  loginPage: LoginPage;
  apiClient: ApiClient;
  testUser: { username: string; password: string; email: string };
  randomData: { id: number; timestamp: string; randomString: string };
  authenticatedPage: Page;
};
type MyWorkerFixtures = {
  authenticatedContext: BrowserContext;
};
const authFile = path.join(__dirname, '../auth.json');

export const test = base.extend<MyFixtures, MyWorkerFixtures>({
  loginPage: async ({ page }, use, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    const loginPage = new LoginPage(page);
    await page.goto('https://www.saucedemo.com/');
    
    await use(loginPage);

    console.log(`Test finished: ${testInfo.status}`);
    await loginPage.takeScreenshot('teardown');
  },

  apiClient: async ({ request }, use) => {
    const api = new ApiClient(request, 'https://jsonplaceholder.typicode.com');
    await use(api);
  },

  // Test user data
  testUser: async ({}, use) => {
    const user = {
      username: 'standard_user',
      password: 'secret_sauce',
      email: `test-${Date.now()}@example.com`,
    };
    await use(user);
  },

  // Random data for uniqueness
  randomData: async ({}, use) => {
    const data = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      randomString: Math.random().toString(36).substring(7),
    };
    await use(data);
  },

  authenticatedContext: [
    async ({ browser }, use) => {
      // Check if we have saved auth state
      if (fs.existsSync(authFile)) {
        console.log('🔄 [Worker] Reusing existing authentication');
        const context = await browser.newContext({ storageState: authFile });
        await use(context);
        await context.close();
        return;
      }

      // First time in this worker - perform login
      console.log('🔐 [Worker] Creating fresh authentication');
      const page = await browser.newPage();
      await page.goto('https://www.saucedemo.com/');
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      await page.click('#login-button');
      await page.waitForURL(/inventory\.html/);
      
      // Save the authenticated state
      await page.context().storageState({ path: authFile });
      await page.close();
      
      // Create and use the authenticated context
      const context = await browser.newContext({ storageState: authFile });
      await use(context);
      await context.close();
    },
    { scope: 'worker' as const }
  ],

  // Test-scoped page that uses the worker-scoped context
  authenticatedPage: async ({ authenticatedContext }, use, testInfo) => {
    const page = await authenticatedContext.newPage();
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    console.log(`📄 [Test] ${testInfo.title} using authenticated page`);
    
    await use(page);
    
    // Cleanup - close the page, but keep context for other tests
    await page.close();
  },
});

export { expect } from '@playwright/test';