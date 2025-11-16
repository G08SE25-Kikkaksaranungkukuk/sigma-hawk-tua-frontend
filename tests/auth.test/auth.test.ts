
import { test, expect } from '@playwright/test';
import { TEST_USERS_DATA } from "../setup/db-seeding";

// --- Helper functions ---
import type { Page } from '@playwright/test';

type SignupFormData = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthYear?: string;
  gender?: string;
  travelStyle?: string;
  budget?: boolean;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

async function fillSignupForm(page: Page, data: SignupFormData) {
  if (data.firstName !== undefined) {
    await page.getByRole('textbox', { name: '👤 First Name' }).fill(data.firstName);
  }
  if (data.middleName !== undefined) {
    await page.getByRole('textbox', { name: '👤 Middle Name (Optional)' }).fill(data.middleName);
  }
  if (data.lastName !== undefined) {
    await page.getByRole('textbox', { name: '👥 Last Name' }).fill(data.lastName);
  }
  if (data.birthYear !== undefined) {
    await page.getByRole('button', { name: 'Select date' }).click();
    await page.getByLabel('Choose the Year').selectOption(data.birthYear);
    await page.getByRole('button', { name: 'Friday, November 1st,' }).click();
  }
  if (data.gender !== undefined) {
    await page.getByRole('button', { name: data.gender }).click();
  }
  if (data.travelStyle !== undefined) {
    await page.getByRole('button', { name: data.travelStyle }).click();
  }
  if (data.budget !== undefined && data.budget) {
    await page.getByRole('checkbox', { name: '💰 Budget' }).click();
  }
  if (data.phone !== undefined) {
    await page.getByRole('textbox', { name: '📱 Phone Number' }).fill(data.phone);
  }
  if (data.email !== undefined) {
    await page.getByRole('textbox', { name: '📧 Email' }).fill(data.email);
  }
  if (data.password !== undefined) {
    await page.getByRole('textbox', { name: '🔒 Password' }).fill(data.password);
    await page.getByRole('textbox', { name: '🔒 Password' }).press('Tab');
  }
  if (data.confirmPassword !== undefined) {
    await page.getByRole('textbox', { name: '🔐 Confirm Password' }).fill(data.confirmPassword);
  }
}

async function scrollModalToBottom(page: Page, modalText: string) {
  await page.getByText(modalText, { exact: true }).click();
  const content = page.locator('div.max-h-64').first();
  await content.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
  await page.getByRole('button', { name: 'Close' }).click();
}

async function enableConsent(page: Page) {
  await scrollModalToBottom(page, 'Terms of Service');
  await scrollModalToBottom(page, 'Privacy Policy');
  await page.locator('#consent').click();
}

async function submitSignup(page: Page) {
  await page.getByRole('button', { name: '🚀 Create My Account' }).click();
}

test.describe('Auth flow', () => {
  test('consent checkbox is disabled until Terms and Privacy are scrolled to bottom', async ({ page }) => {
    await page.goto('/signup');
    const consent = page.locator('#consent');
    const submit = page.locator('button[type="submit"]');
    await expect(consent).toBeDisabled();
    await expect(submit).toBeDisabled();
    await scrollModalToBottom(page, 'Terms of Service');
    await expect(consent).toBeDisabled();
    await scrollModalToBottom(page, 'Privacy Policy');
    await expect(consent).toBeEnabled();
    await consent.click();
    await expect(consent).toBeChecked();
    await expect(submit).toBeEnabled();
  });

  test('register flow', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      firstName: 'aaa',
      middleName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      phone: '123-456-7890',
      email: '1@gmail.com',
      password: '@Admin55',
      confirmPassword: '@Admin55',
    });
    await enableConsent(page);
    await expect(page.getByRole('button', { name: '🚀 Create My Account' })).toBeEnabled();
  });

  test('register fails with missing required fields', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      middleName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      phone: '123-456-7890',
      email: '1@gmail.com',
      password: '@Admin55',
      confirmPassword: '@Admin55',
    });
    await enableConsent(page);
    await submitSignup(page);
    await expect(page.locator('form')).toContainText('⚠️ First name is required and must be at least 2 characters');
  });

  test('register fails with invalid email format', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      middleName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      phone: '123-456-7890',
      password: '@Admin55',
      confirmPassword: '@Admin55',
    });
    await enableConsent(page);
    await submitSignup(page);
    await expect(page.locator('form')).toContainText('⚠️ Please enter a valid email address');
  });

  test('register fails when password and confirm password do not match', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      firstName: 'aaa',
      middleName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      phone: '123-456-7890',
      email: '1@gmail.com',
      password: '@Admin55',
      confirmPassword: '@Admin551',
    });
    await enableConsent(page);
    await submitSignup(page);
    await expect(page.locator('form')).toContainText("⚠️ Passwords don't match");
  });

  test('register fails with short password', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      firstName: 'aaa',
      middleName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      phone: '123-456-7890',
      email: '1@gmail.com',
      password: '@Adn55',
      confirmPassword: '@Adn55',
    });
    await enableConsent(page);
    await submitSignup(page);
    await expect(page.locator('form')).toContainText('⚠️ Password is required and must be at least 8 characters');
  });

  test('register fails with invalid phone number format', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      firstName: 'aaa',
      middleName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      email: '1@gmail.com',
      password: '@Admin55',
      confirmPassword: '@Admin551',
    });
    await enableConsent(page);
    await submitSignup(page);
    await expect(page.locator('form')).toContainText('⚠️ Invalid phone number format');
  });

  test('register fails with duplicate email', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      firstName: 'aaa',
      middleName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      phone: '123-456-7890',
      email: 'jotest11@gmail.com',
      password: '@Admin55',
      confirmPassword: '@Admin55',
    });
    await enableConsent(page);
    await submitSignup(page);
    await expect(page.locator('form')).toContainText('⚠️ This email cannot be used for registration.');
  });

  test('register succeeds with missing optional middle name', async ({ page }) => {
    await page.goto('/signup');
    await fillSignupForm(page, {
      firstName: 'aaa',
      lastName: 'aaa',
      birthYear: '1991',
      gender: '👨 Male',
      travelStyle: '🌊 Sea',
      budget: true,
      phone: '123-456-7890',
      email: '1@gmail.com',
      password: '@Admin55',
      confirmPassword: '@Admin55',
    });
    await enableConsent(page);
    await expect(page.getByRole('button', { name: '🚀 Create My Account' })).toBeEnabled();
  });

  // ...existing code...


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
