import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA } from "../setup/db-seeding"
import { TestHelpers } from "../test-helpers"

test.describe("User Tests", () => {
    test("user can login", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        // Login verification is already done in helper
    })

    test("user can delete account", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testDeleteUser
        console.log(`🧪 Testing account deletion for: ${testUser.email}`)

        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "B", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()

        await page.getByRole("button", { name: "Delete Account" }).click()
        await page
            .getByRole("textbox", { name: "Enter your password to confirm" })
            .fill(testUser.password)

        page.once("dialog", (dialog) => {
            console.log(`Dialog message: ${dialog.message()}`)
            dialog.dismiss().catch(() => {})
        })
        await page.getByRole("button", { name: "Delete Account" }).click()

        // Try to login again to verify account was deleted
        await page.goto("/")
        await page.getByRole("button", { name: "✨ Sign In" }).click()
        await page.getByRole("textbox", { name: "Email" }).click()
        await page.getByRole("textbox", { name: "Email" }).fill(testUser.email)
        await page.getByRole("textbox", { name: "Password" }).click()
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(testUser.password)
        await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()
        await expect(page.getByText("Invalid email or password.")).toBeVisible()
    })

    test("user can not delete account", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        console.log(
            `🧪 Testing can not account deletion for: ${testUser.email} with "Wrong Password"`
        )

        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()

        await page.getByRole("button", { name: "Delete Account" }).click()
        await page
            .getByRole("textbox", { name: "Enter your password to confirm" })
            .fill("WRONG_PASSWORD") // Use fake password

        page.once("dialog", (dialog) => {
            console.log(`Dialog message: ${dialog.message()}`)
            dialog.dismiss().catch(() => {})
        })
        await page.getByRole("button", { name: "Delete Account" }).click()
        await expect(page.getByText("Invalid password")).toBeVisible()
    })
})
