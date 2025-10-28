import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: '✨ Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('jo@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Gu#yi7tu007');
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