import { Page } from '@playwright/test';
import { TEST_USERS } from '../setup/seed-test-data';

/**
 * Helper function to login a test user
 */
export async function loginAsTestUser(page: Page, userKey: keyof typeof TEST_USERS = 'testUser1') {
  const user = TEST_USERS[userKey];
  
  await page.goto('/');
  await page.getByRole('button', { name: '✨ Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: '✨ Sign In & Explore' }).click();
  
  // Wait for successful login
  await page.getByRole('heading', { name: 'Login Successful!' }).waitFor();
}

/**
 * Helper function to navigate to profile page
 */
export async function navigateToProfile(page: Page) {
  await page.getByRole('button', { name: 'J', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Profile Management' }).click();
}

/**
 * Helper function to logout
 */
export async function logout(page: Page) {
  await page.getByRole('button', { name: 'J', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
}
