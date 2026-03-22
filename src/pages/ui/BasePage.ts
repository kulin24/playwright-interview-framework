import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}
  
  async goto(url: string) {
    await this.page.goto(url);
  }
  
  async waitForLoadState() {
    // networkidle = no network connections for at least 500ms
    await this.page.waitForLoadState('networkidle');
  }
  
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `debug-artifacts/screenshots/${name}-${Date.now()}.png`,
      fullPage: true  // Capture entire scrollable page, not just viewport
    });
  }
  
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
  
  async expectTitle(title: string | RegExp, timeout?: number) {
    await this.page.waitForFunction(
      (expectedTitle) => document.title.match(expectedTitle),
      title,
      { timeout: timeout ?? 30000 }
    );
  }
}