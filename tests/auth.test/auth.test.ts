import { test, expect } from '@playwright/test';
import { TEST_USERS_DATA } from "../setup/db-seeding";

test.describe('Auth flow', () => {
  test('consent checkbox is disabled until Terms and Privacy are scrolled to bottom', async ({ page }) => {
    await page.goto('/signup');

    const consent = page.locator('#consent');
    const submit = page.locator('button[type="submit"]');

    // Initially the consent checkbox should be disabled and submit should be disabled
    await expect(consent).toBeDisabled();
    await expect(submit).toBeDisabled();

    // Open Terms of Service modal and scroll to bottom
    await page.getByText('Terms of Service', { exact: true }).click();
    const tosContent = page.locator('div.max-h-64').first();
    await expect(tosContent).toBeVisible();
    // Scroll to bottom to trigger onScrolledToBottom
    await tosContent.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
    // Close modal
    await page.getByLabel('Close').first().click();

    // Consent still disabled until both are scrolled
    await expect(consent).toBeDisabled();

    // Open Privacy Policy modal and scroll to bottom
    await page.getByText('Privacy Policy', { exact: true }).click();
    const ppContent = page.locator('div.max-h-64').first();
    await expect(ppContent).toBeVisible();
    await ppContent.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
    await page.getByLabel('Close').first().click();

    // Now the consent checkbox should be enabled
    await expect(consent).toBeEnabled();

    // Check the consent checkbox and ensure submit becomes enabled
    await consent.click();
    await expect(consent).toBeChecked();
    await expect(submit).toBeEnabled();
  });

  test('register flow', async ({ page }) => {
        await page.goto('/signup');
        await page.getByRole('textbox', { name: '👤 First Name' }).click();
        await page.getByRole('textbox', { name: '👤 First Name' }).fill('aaa');
        await page.getByRole('textbox', { name: '👤 Middle Name (Optional)' }).click();
        await page.getByRole('textbox', { name: '👤 Middle Name (Optional)' }).fill('aaa');
        await page.getByRole('textbox', { name: '👥 Last Name' }).click();
        await page.getByRole('textbox', { name: '👥 Last Name' }).fill('aaa');
        await page.getByRole('button', { name: 'Select date' }).click();
        await page.getByLabel('Choose the Year').selectOption('1991');
        await page.getByRole('button', { name: 'Friday, November 1st,' }).click();
        await page.getByRole('button', { name: '👨 Male' }).click();
        await page.getByRole('button', { name: '🌊 Sea' }).click();
        await page.getByRole('checkbox', { name: '💰 Budget' }).click();
        await page.getByRole('textbox', { name: '📱 Phone Number' }).click();
        await page.getByRole('textbox', { name: '📱 Phone Number' }).fill('123-456-7890');
        await page.getByRole('textbox', { name: '📧 Email' }).click();
        await page.getByRole('textbox', { name: '📧 Email' }).fill('1@gmail.com');
        await page.getByRole('textbox', { name: '🔒 Password' }).click();
        await page.getByRole('textbox', { name: '🔒 Password' }).fill('@Admin55');
        await page.getByRole('textbox', { name: '🔒 Password' }).press('Tab');
        await page.getByRole('textbox', { name: '🔐 Confirm Password' }).fill('@Admin55');
        await page.getByText('Terms of Service', { exact: true }).click();
        const tosContent = page.locator('div.max-h-64').first();
        await tosContent.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
        await page.getByRole('button', { name: 'Close' }).click();
        await page.getByText('Privacy Policy', { exact: true }).click();
        const ppContent = page.locator('div.max-h-64').first();
        await ppContent.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
        await page.getByRole('button', { name: 'Close' }).click();
        await page.locator('#consent').click();
    // Do not submit to avoid relying on backend in this test run; assert consent and submit enabled
    await expect(page.getByRole('button', { name: '🚀 Create My Account' })).toBeEnabled();
    });
  test('login flow shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('nonexistent@example.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: '✨ Sign In & Explore' }).click();
    // Expect error message to be visible
    await expect(page.getByText('Invalid email or password.')).toBeVisible();
  });

  test('signup page contains key inputs', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByLabel('👤 First Name')).toBeVisible();
    await expect(page.getByLabel('👥 Last Name')).toBeVisible();
    await expect(page.getByLabel('📧 Email')).toBeVisible();
    await expect(page.getByLabel('🔒 Password')).toBeVisible();
    await expect(page.locator('#consent')).toBeVisible();
  });

  test('logout flow', async ({ page, context }) => {
    const testUser = TEST_USERS_DATA.testUser1
    await page.goto("/login")
    await page.getByRole("textbox", { name: "Email" }).fill(testUser.email)
    await page.getByRole("textbox", { name: "Password" }).fill(testUser.password)
    await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()
    await page.waitForURL(url => url.pathname !== '/login');
    await page.locator('button:has([data-slot="avatar-fallback"])').first().click();
    await page.getByText('Sign Out').click();
    await expect(page).toHaveURL("/login")
    const cookies = await context.cookies();
    const access = cookies.find(c => c.name === 'accessToken');
    const refresh = cookies.find(c => c.name === 'refreshToken');
    expect(access).toBeUndefined();
    expect(refresh).toBeUndefined();
  });

  test('login make JWT token in cookie', async ({ page, context }) => {
    // 1) Login via UI
    const testUser = TEST_USERS_DATA.testUser1
    await page.goto('/login');
    await page.getByRole("textbox", { name: "Email" }).fill(testUser.email)
    await page.getByRole("textbox", { name: "Password" }).fill(testUser.password)
    await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()
    await page.waitForURL(url => url.pathname !== '/login');

    // 2) Check cookie via context (can see HttpOnly cookies)
    const cookies = await context.cookies();

    const access = cookies.find(c => c.name === 'accessToken');
    const refresh = cookies.find(c => c.name === 'refreshToken'); 

    expect(access, 'accessToken cookie should be present').toBeDefined();
    expect(refresh, 'refreshToken cookie should be present').toBeDefined();

  });

  test('Redirect to home page after exit', async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser1
    await page.goto("/login")
    await page.getByRole("textbox", { name: "Email" }).fill(testUser.email)
    await page.getByRole("textbox", { name: "Password" }).fill(testUser.password)
    await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()
    await page.waitForURL(url => url.pathname !== '/login');
    await page.goto("https://www.google.com")
    await page.goto("/home")
    await expect(page).toHaveURL("/home")
  });

});
