import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../setup/seed-test-data';

test('user can login and update profile', async ({ page }) => {
  const testUser = TEST_USERS.testUser1;
  
  // Use relative URL to respect baseURL from config
  await page.goto('/');
  await page.getByRole('button', { name: '✨ Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(testUser.email);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(testUser.password);
  await page.getByRole('button', { name: '✨ Sign In & Explore' }).click();
  await page.getByRole('heading', { name: 'Login Successful!' }).click();
  await page.getByRole('button', { name: 'J', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Profile Management' }).click();
  await page.getByRole('textbox', { name: '👤 First Name *' }).dblclick();
  await page.getByRole('textbox', { name: '👤 First Name *' }).fill('jacky555');
  await page.getByRole('textbox', { name: '👤 First Name *' }).click();
  await page.getByRole('button', { name: 'Confirm Changes' }).click();
  await page.getByRole('heading', { name: 'Profile Updated! 🎉' }).click();
  await page.getByText('jacky555 chanah').click();
});