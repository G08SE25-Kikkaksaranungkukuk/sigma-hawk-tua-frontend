import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA, TestGroup } from "../setup/db-seeding"

test("user can login", async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser1

    await page.goto("/")
    await page.getByRole("button", { name: "✨ Sign In" }).click()
    await page.getByRole("textbox", { name: "Email" }).click()
    await page.getByRole("textbox", { name: "Email" }).fill(testUser.email)
    await page.getByRole("textbox", { name: "Password" }).click()
    await page
        .getByRole("textbox", { name: "Password" })
        .fill(testUser.password)
    await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()

    // Verify successful login by checking we're redirected to home page
    await expect(page).toHaveURL("/home")
})

test("user can delete account", async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser1
    await page.goto("/")
    await page.getByRole("button", { name: "✨ Sign In" }).click()
    await page.getByRole("textbox", { name: "Email" }).click()
    await page.getByRole("textbox", { name: "Email" }).fill(testUser.email)
    await page.getByRole("textbox", { name: "Password" }).click()
    await page
        .getByRole("textbox", { name: "Password" })
        .fill(testUser.password)
    await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()
    await page.getByRole("button", { name: "J", exact: true }).click()
    await page.getByRole("menuitem", { name: "Profile Management" }).click()

    await page.getByRole("button", { name: "Delete Account" }).click()
    await page
        .getByRole("textbox", { name: "Enter your password to confirm" })
        .fill("Test8888!")
    page.once("dialog", (dialog) => {
        console.log(`Dialog message: ${dialog.message()}`)
        dialog.dismiss().catch(() => {})
    })
    await page.getByRole("button", { name: "Delete Account" }).click()
})
