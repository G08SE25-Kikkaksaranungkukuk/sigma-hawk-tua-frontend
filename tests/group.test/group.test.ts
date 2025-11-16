import { test, expect } from '@playwright/test';
import { TEST_USERS_DATA } from '../setup/db-seeding';
import { TestHelpers } from '../test-helpers';

test.describe('Group Tests', () => {

  test('Create Group', async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser2;
    await TestHelpers.loginUser(page, testUser);
    await page.getByRole('button', { name: 'Create Group' }).click();
    await page.getByRole('textbox', { name: 'Enter group title...' }).click();
    await page.getByRole('textbox', { name: 'Enter group title...' }).fill('test A');
    await page.getByRole('textbox', { name: 'Describe your travel group' }).click();
    await page.getByRole('textbox', { name: 'Describe your travel group' }).fill('this is test group a');
    await page.getByRole('textbox', { name: 'Where are you planning to go?' }).click();
    await page.getByRole('textbox', { name: 'Where are you planning to go?' }).fill('nonthaburi');
    await page.getByRole('textbox').nth(3).fill('2026-11-09');
    await page.getByRole('textbox').nth(4).fill('2026-11-16');
    await page.getByRole('button', { name: '🏖️ Sea & Beach' }).click();
    await page.getByRole('button', { name: '⛰️ Mountain & Hills' }).click();
    await page.getByRole('button', { name: '⛰️ Mountain & Hills' }).click();
    await page.getByRole('button', { name: '💧 Waterfalls' }).click();
    await page.getByRole('button', { name: '⛰️ Mountain & Hills' }).click();
    await page.getByRole('button', { name: '🛍️ Shopping Malls' }).click();
    await page.getByRole('button', { name: '🏪 Local Markets' }).click();
    await page.getByRole('button', { name: '☕ Cafes & Coffee' }).click();
    await page.getByRole('button', { name: '🎉 Festivals & Events' }).click();
    await page.getByRole('button', { name: '🏛️ Museums & Galleries' }).click();
    await page.getByRole('button', { name: '🍴 Food Streets' }).click();
    await page.getByRole('button', { name: 'Continue to Itineraries' }).click();
    await page.getByRole('button', { name: 'New Itinerary' }).click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('pump');
    await page.getByRole('textbox', { name: 'Start Date' }).fill('2026-11-12');
    await page.getByRole('textbox', { name: 'End Date' }).fill('2026-11-13');
    await page.getByRole('button', { name: 'Create Itinerary' }).click();
    await page.getByRole('button', { name: 'New Itinerary' }).click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('pump b');
    await page.getByRole('textbox', { name: 'Start Date' }).fill('2026-11-15');
    await page.getByRole('textbox', { name: 'End Date' }).fill('2026-11-16');
    await page.getByRole('button', { name: 'Create Itinerary' }).click();
    await page.getByRole('button', { name: 'Complete Group Setup' }).click();
    await expect(page.getByRole('heading', { name: 'test A' })).toBeVisible();
  });

  test('Share Group', async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser1;
    await TestHelpers.loginUser(page, testUser);
    await page.getByRole('button', { name: 'View' }).click();
    await page.getByRole('button', { name: 'Share' }).click();
    await page.getByRole('button', { name: 'Copy' }).click();
    await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
  });

  test('Filter Group Members', async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser1;
    await TestHelpers.loginUser(page, testUser);
    await page.getByRole('link', { name: 'Groups', exact: true }).click();
    await page.getByRole('button', { name: '🏖️ Sea & Beach' }).click();
    await expect(page.getByText('beach-trip', { exact: true })).toBeVisible();
  });

  test('Edit Group Members', async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser1;
    await TestHelpers.loginUser(page, testUser);
    await page.getByRole('button', { name: 'View' }).first().click();
    await page.getByRole('button', { name: 'Manage Group' }).click();
      await page.getByRole('tab', { name: 'Members' }).click();
    const memberRow = page.locator('div').filter({hasText: /^Jane Doejanetest@gmail.com • 27Y$/}).first();
    await memberRow.scrollIntoViewIfNeeded();
    await expect(memberRow).toBeVisible();
    await memberRow.getByRole('button', { name: 'Transfer ownership' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Transfer Ownership' })).toBeVisible();
    await page.getByRole('button', { name: 'Transfer Ownership' }).click();
    await expect(page.getByRole('button', { name: 'Leave Group' })).toBeVisible();
  });

});
