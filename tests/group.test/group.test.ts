import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA, cleanupTestUsers, seedTestUsers } from "../setup/db-seeding"
import { TestHelpers } from "../test-helpers"

test.describe("Group Tests", () => {
    test.beforeEach(async () => {
        try {
            await cleanupTestUsers();
            await seedTestUsers();
        } catch (error) {
        }
    });

    test('Create Schedule', async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('button', { name: 'Create Group' }).click();
        await page.getByRole('textbox', { name: 'Enter group title...' }).click();
        await page.getByRole('textbox', { name: 'Enter group title...' }).fill('samyan');
        await page.getByRole('textbox', { name: 'Describe your travel group' }).dblclick();
        await page.getByRole('textbox', { name: 'Describe your travel group' }).fill('go go samyan');
        await page.getByRole('textbox', { name: 'Where are you planning to go?' }).click();
        await page.getByRole('textbox', { name: 'Where are you planning to go?' }).fill('go take some rest');
        await page.getByRole('textbox').nth(3).fill('2025-12-15');
        await page.getByRole('textbox').nth(4).fill('2025-12-18');
        await page.getByRole('button', { name: '🏖️ Sea & Beach' }).click();
        await page.getByRole('button', { name: 'Continue to Itineraries' }).click();
        await page.getByRole('button', { name: 'New Itinerary' }).click();
        await page.getByRole('textbox', { name: 'Title' }).click();
        await page.getByRole('textbox', { name: 'Title' }).fill('test1');
        await page.getByRole('textbox', { name: 'Start Date' }).fill('2025-12-15');
        await page.getByRole('textbox', { name: 'End Date' }).fill('2025-12-16');
        await page.getByRole('textbox', { name: 'Description' }).dblclick();
        await page.getByRole('textbox', { name: 'Description' }).fill('KFC');
        await page.getByRole('button', { name: 'Search Places' }).click();
        await page.getByRole('textbox', { name: 'Search for places,' }).fill('chula');
        await page.waitForTimeout(5000);
        await page.getByRole('button', { name: 'Chulalongkorn University 4.7' }).click();
        await page.getByRole('button', { name: 'Create Itinerary' }).click();
        await page.getByRole("button", { name: "Create Itinerary" }).click();
        await expect(page.getByRole('heading', { name: 'test1' })).toBeVisible();
        await expect(page.getByText('KFC', { exact: true })).toBeVisible();
        await expect(page.getByText('Dec 15, 2025 - Dec 16,')).toBeVisible();
        await expect(page.getByText('day')).toBeVisible();
        await expect(page.getByText('1 place')).toBeVisible();
    });

    test('View Schedule', async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('button', { name: 'View' }).first().click();
        await page.getByRole('button', { name: 'Itinerary' }).click();
        await page.waitForTimeout(5000);
        await expect(page.getByRole('heading', { name: 'Samyan' })).toBeVisible();
        await expect(page.getByText('Relaxing day at the beach with water activities')).toBeVisible();
        await expect(page.getByText('Jun 15, 2023 - Jun 15, 2023')).toBeVisible();
        await expect(page.getByText('1 day')).toBeVisible();
        await expect(page.getByText('1 place').first()).toBeVisible();
    });

    test("user can manage group itineraries", async ({ page }) => {
        // Use test user data from seeding
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)

        // Navigate to group management
        await page.getByRole("button", { name: "View" }).first().click()
        await page.getByRole("button", { name: "Manage Group" }).click()

        // Switch to Itineraries tab
        await page.getByRole("tab", { name: "Itineraries" }).click()

        // Create new itinerary with dates only
        await page.getByRole("button", { name: "Create Itinerary" }).click()
        await page.getByRole('textbox', { name: 'Title' }).fill('test123');
        await page.getByRole("textbox", { name: "Start Date" }).fill("2023-06-16")
        await page.getByRole("textbox", { name: "End Date" }).fill("2023-06-17")
        await page.getByRole("button", { name: "Create Itinerary" }).click()

        //expectation for created itinerary
        await expect(page.getByRole("heading", { name: "test123" })).toBeVisible();
        await expect(page.getByText("Jun 16, 2023 - Jun 17, 2023")).toBeVisible();


        // Update existing itinerary
        await page.getByRole("button").nth(4).click()
        await page.getByRole("textbox", { name: "End Date" }).fill("2023-06-18")
        await page.getByRole("button", { name: "Update Itinerary" }).click()
        await expect(page.getByText("Jun 16, 2023 - Jun 18, 2023")).toBeVisible();

        // Delete itinerary
        await page.getByRole('button').nth(5).click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByRole("heading", { name: "test123" })).not.toBeVisible();

    })

})
