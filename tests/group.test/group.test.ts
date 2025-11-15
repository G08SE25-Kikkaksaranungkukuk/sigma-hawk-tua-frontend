import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA } from "../setup/db-seeding"
import { TestHelpers } from "../test-helpers"

test.describe("Group Tests", () => {
    test('Create Schedule', async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('button', { name: 'Create Group' }).click();
        await page.getByRole('textbox', { name: 'Enter group title...' }).click();
        await page.getByRole('textbox', { name: 'Enter group title...' }).fill('uyuyuyu');
        await page.getByRole('textbox', { name: 'Describe your travel group' }).dblclick();
        await page.getByRole('textbox', { name: 'Describe your travel group' }).fill('tyutyutyutyutyu');
        await page.getByRole('textbox', { name: 'Where are you planning to go?' }).click();
        await page.getByRole('textbox', { name: 'Where are you planning to go?' }).fill('ytutyutyutyu');
        await page.getByRole('textbox').nth(3).fill('2025-11-15');
        await page.getByRole('textbox').nth(4).fill('2025-11-18');
        await page.getByRole('button', { name: '🏖️ Sea & Beach' }).click();
        await page.getByRole('button', { name: 'Continue to Itineraries' }).click();
        await page.getByRole('button', { name: 'New Itinerary' }).click();
        await page.getByRole('textbox', { name: 'Title' }).click();
        await page.getByRole('textbox', { name: 'Title' }).fill('KUY');
        await page.getByRole('textbox', { name: 'Start Date' }).fill('2025-11-15');
        await page.getByRole('textbox', { name: 'End Date' }).fill('2025-11-16');
        await page.getByRole('textbox', { name: 'Description' }).dblclick();
        await page.getByRole('textbox', { name: 'Description' }).fill('asdasd');
        await page.getByRole('button', { name: 'Search Places' }).click();
        await page.getByRole('textbox', { name: 'Search for places,' }).fill('chula');
        await page.getByRole('button', { name: 'Chulalongkorn University 4.7' }).click();
        await page.getByRole('button', { name: 'Create Itinerary' }).click();
        await expect(page.getByRole('heading', { name: 'KUY' })).toBeVisible();
        await expect(page.getByText('asdasd', { exact: true })).toBeVisible();
        await expect(page.getByText('Nov 15, 2025 - Nov 16,')).toBeVisible();
        await expect(page.getByText('day')).toBeVisible();
        await expect(page.getByText('1 place')).toBeVisible();
    });

    test('View Schedule', async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('button', { name: 'View' }).first().click();
        await page.getByRole('button', { name: 'Itinerary' }).click();
        await expect(page.getByRole('heading', { name: 'Samyan' })).toBeVisible();
        await expect(page.getByText('Relaxing day at the beach with water activities')).toBeVisible();
        await expect(page.getByText('Jun 15, 2023 - Jun 15, 2023')).toBeVisible();
        await expect(page.getByText('1 day')).toBeVisible();
        await expect(page.getByText('1 place').first()).toBeVisible();
    });

})
