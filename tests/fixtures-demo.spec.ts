import { test, expect } from '../src/fixtures/customFixtures';

test.describe('Custom Fixtures Demo @regression', () => {
  test('@ui should use loginPage fixture', async ({ loginPage }) => {
    // loginPage is already at SauceDemo login page
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.expectSuccessfulLogin();
    console.info('✅ Login page fixture worked!');
  });

  test('@api should use apiClient fixture', async ({ apiClient }) => {
    const response = await apiClient.get('/posts/1');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(1);
    console.info('✅ API client fixture worked!');
  });

  test('should use authenticatedPage fixture', async ({ authenticatedPage }) => {
    // authenticatedPage is already logged in and on inventory page
    await expect(authenticatedPage).toHaveURL(/inventory/);
    
    // Add item to cart
    await authenticatedPage.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    const cartBadge = authenticatedPage.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText('1');
    console.info('✅ Authenticated page fixture worked!');
  });

  test('should use testUser fixture', async ({ loginPage, testUser }) => {
    console.info(`Testing with user: ${testUser.username}`);
    await loginPage.login(testUser.username, testUser.password);
    await loginPage.expectSuccessfulLogin();
    console.info('✅ Test user fixture worked!');
  });
});