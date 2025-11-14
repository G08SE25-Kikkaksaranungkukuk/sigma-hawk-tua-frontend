import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA } from "../setup/db-seeding"
import { TestHelpers } from "../test-helpers"

test.describe("User Review Tests", () => {
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
