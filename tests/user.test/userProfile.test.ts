import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA } from "../setup/db-seeding"
import { TestHelpers } from "../test-helpers"

test.describe("User Profile Tests", () => {
    test("user can view other user's profile", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)

        await page.getByRole("button", { name: "View" }).click()
        await page.getByRole("img", { name: "Jo Chanah" }).click()
        await expect(
            page.getByRole("heading", { name: "Jo Chanah" })
        ).toBeVisible()
        await expect(page.getByText("jotest11@gmail.com")).toBeVisible()
        await expect(page.getByText("0812345678")).toBeVisible()
    })

    test("user can update profile successfully", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()

        // Update profile fields
        await page.getByRole("textbox", { name: "👤 First Name *" }).click()
        await page
            .getByRole("textbox", { name: "👤 First Name *" })
            .fill("jacky123")
        await page.getByRole("textbox", { name: "👤 Last Name *" }).click()
        await page
            .getByRole("textbox", { name: "👤 Last Name *" })
            .fill("Chanahhh")
        await page
            .getByRole("textbox", { name: "👤 Middle Name (optional)" })
            .click()
        await page
            .getByRole("textbox", { name: "👤 Middle Name (optional)" })
            .fill("What")

        // Update interests
        await page.getByRole("button", { name: "🏖️ Sea & Beach" }).click()
        await page.getByRole("button", { name: "⛰️ Mountain & Hills" }).click()
        await page.getByRole("button", { name: "💧 Waterfalls" }).click()
        await page.getByRole("button", { name: "🙏 Temples & Shrines" }).click()
        await page.getByRole("button", { name: "🏛️ Historical Sites" }).click()
        await page.getByRole("button", { name: "🏞️ National Parks" }).click()
        await page.getByRole("button", { name: "☕ Cafes & Coffee" }).click()

        // Update travel styles
        await page.locator(".w-5.h-5.rounded").first().click()
        await page.locator("div:nth-child(2) > .relative > .w-5").click()

        // Update phone
        await page.getByRole("textbox", { name: "📱 Phone Number *" }).click()
        await page
            .getByRole("textbox", { name: "📱 Phone Number *" })
            .fill("064-805-5426")

        await page.getByRole("button", { name: "Confirm Changes" }).click()

        // Verify success
        await expect(page).toHaveURL("/home", { timeout: 10000 })
    })

    test("user cannot update profile with invalid data", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()

        // Try invalid phone number
        await page.getByRole("textbox", { name: "📱 Phone Number *" }).click()
        await page
            .getByRole("textbox", { name: "📱 Phone Number *" })
            .fill("064-905-")

        // Check validation message appears
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()

        // Clear required fields
        await page.getByRole("textbox", { name: "👤 First Name *" }).dblclick()
        await page.getByRole("textbox", { name: "👤 First Name *" }).fill("")
        await page.getByRole("textbox", { name: "👤 Last Name *" }).dblclick()
        await page.getByRole("textbox", { name: "👤 Last Name *" }).fill("")

        // Validation message should still be visible
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()
    })

    test("user can submit a review for another user", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)

        // Navigate to view other user's profile
        await page.getByRole("button", { name: "View" }).click()
        await page.getByRole("heading", { name: "Jane Doe" }).click()
        
        // Submit review ratings
        await page.getByRole("button", { name: "Set trust_score to 4 stars" }).click()
        await page.getByRole("button", { name: "Set engagement_score to 5" }).click()
        await page.getByRole("button", { name: "Set experience_score to 3" }).click()
        await page.getByRole("button", { name: "Submit Rating" }).click()

        // Verify navigation to profile page Jane Doe id is 4
        await expect(page).toHaveURL("/profile/view/4")
        
        // Verify review submission success (you may want to add more specific assertions)
        await expect(page.getByRole("heading", { name: "Jane Doe" })).toBeVisible()
    })
})
