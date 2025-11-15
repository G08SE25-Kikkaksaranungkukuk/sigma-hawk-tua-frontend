import { expect, Page } from "@playwright/test"
import { TestUser } from "./setup/db-seeding"

/**
 * Shared test utilities for common actions across all test files
 */
export class TestHelpers {
    /**
     * Login with any user and verify successful navigation to home page
     */
    static async loginUser(page: Page, userData: TestUser): Promise<void> {
        await page.goto("/")
        await page.getByRole("button", { name: "✨ Sign In" }).click()
        await page.getByRole("textbox", { name: "Email" }).click()
        await page.getByRole("textbox", { name: "Email" }).fill(userData.email)
        await page.getByRole("textbox", { name: "Password" }).click()
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(userData.password)
        await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()
        await expect(page).toHaveURL("/home")
    }

    /**
     * Fill login form without submitting
     */
    static async fillLoginForm(page: Page, userData: TestUser): Promise<void> {
        await page.goto("/")
        await page.getByRole("button", { name: "✨ Sign In" }).click()
        await page.getByRole("textbox", { name: "Email" }).click()
        await page.getByRole("textbox", { name: "Email" }).fill(userData.email)
        await page.getByRole("textbox", { name: "Password" }).click()
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(userData.password)
    }
}
