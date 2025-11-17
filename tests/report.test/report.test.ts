import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA, cleanupTestUsers, seedTestUsers } from "../setup/db-seeding"
import { TestHelpers } from "../test-helpers"


test.describe("User Report Problem", () => {
    test("user can report problem", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('link', { name: 'Report a Problem' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).fill('TestReport');
        await page.getByRole('combobox').click();
        await page.getByText('🐛 Bug/Error', { exact: true }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).fill('This is a test report');
        await page.getByRole('button', { name: 'Submit Report' }).click();
        await expect(page.getByRole('heading', { name: 'Report Submitted' })).toBeVisible();
        await page.goto('/home');
    })

    test("user can not report problem with empty title", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('link', { name: 'Report a Problem' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).fill('');
        await page.getByRole('combobox').click();
        await page.getByText('🐛 Bug/Error', { exact: true }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).fill('This is a test report');
        await page.getByRole('button', { name: 'Submit Report' }).click();
        await expect(page.getByText('Title must be at least 3')).toBeVisible();

    })

    test("user can not report problem with empty type", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('link', { name: 'Report a Problem' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).fill('TestReport');
        await page.getByRole('textbox', { name: 'Please provide details about' }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).fill('This is a test report');
        await page.getByRole('button', { name: 'Submit Report' }).click();
        await expect(page.getByText('Please select a reason')).toBeVisible();
    })

    test("user can not report problem with empty details", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('link', { name: 'Report a Problem' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).fill('TestReport');
        await page.getByRole('combobox').click();
        await page.getByText('🐛 Bug/Error', { exact: true }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).fill('');
        await page.getByRole('button', { name: 'Submit Report' }).click();
        await expect(page.getByText('Description must be at least')).toBeVisible();
    })
})

test.describe("Admin View Reported Problem", () => {
    test("admin can view reported problem", async ({ page }) => {
        const adminUser = TEST_USERS_DATA.adminUser
        await TestHelpers.loginUser(page, adminUser)
        await page.goto('/admin');
        await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    })

    test("User cant view reported problem", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.goto('/admin');
        await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).not.toBeVisible();
    })

    test("admin can resolve reported problem", async ({ page }) => {
        const adminUser = TEST_USERS_DATA.adminUser
        await TestHelpers.loginUser(page, adminUser)
        await page.goto('http://localhost:3000/report');
        await page.getByRole('textbox', { name: 'Brief title for the report' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).fill('Bug found in my room');
        await page.getByRole('combobox').click();
        await page.getByText('🐛 Bug/Error', { exact: true }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).fill('Big Black Bug in my room');
        await page.getByRole('button', { name: 'Submit Report' }).click();
        await page.goto('/admin');
        await page.getByRole('button', { name: 'Mark as Resolved' }).click();
        await expect(page.getByText('Report marked as resolved')).toBeVisible();
    })

    test("admin can search and filter reported problem", async ({ page }) => {
        const adminUser = TEST_USERS_DATA.adminUser
        await TestHelpers.loginUser(page, adminUser)
        await page.goto('http://localhost:3000/report');
        await page.getByRole('textbox', { name: 'Brief title for the report' }).click();
        await page.getByRole('textbox', { name: 'Brief title for the report' }).fill('Bug found in my room');
        await page.getByRole('combobox').click();
        await page.getByText('🐛 Bug/Error', { exact: true }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).click();
        await page.getByRole('textbox', { name: 'Please provide details about' }).fill('Big Black Bug in my room');
        await page.getByRole('button', { name: 'Submit Report' }).click();

        await page.goto('/admin');
        await page.getByRole('textbox', { name: 'Search reports...' }).click();
        await page.getByRole('textbox', { name: 'Search reports...' }).fill('Bug found');
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.getByText('Bug found in my room')).toBeVisible();
        await page.getByRole('textbox', { name: 'Search reports...' }).fill('easy report');
        await expect(page.getByText('Bug found in my room')).not.toBeVisible();
        await page.getByRole('textbox', { name: 'Search reports...' }).fill('');
        await page.getByRole('combobox', { name: 'Filter by Status' }).click();
        await page.getByText('Unresolved', { exact: true }).click();
        await expect(page.getByText('Unresolved')).toBeVisible();
        await page.getByRole('combobox', { name: 'Filter by Reason' }).click();
        await page.getByText('🐛 Bug/Error', { exact: true }).click();
        await expect(page.getByText('🐛 Bug/Error')).toBeVisible();
    })


})

