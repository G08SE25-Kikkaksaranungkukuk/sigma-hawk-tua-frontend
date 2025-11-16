import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA } from "../setup/db-seeding"
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
