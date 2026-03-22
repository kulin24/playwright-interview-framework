import { test, expect } from '@playwright/test';

test.describe('Framework Verification @smoke @regression', () => {
  
  test('should verify Playwright is working @ui', async ({ page }) => {
    console.error('✅ Framework is ready!');
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBe('Example Domain');
    console.error(`Page title: ${title}`);
  });
  
  test('should verify API client with public API @api', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data.title).toBeDefined();
    expect(data.body).toBeDefined();
    console.error('✅ API test passed:', data.title);
  });
});