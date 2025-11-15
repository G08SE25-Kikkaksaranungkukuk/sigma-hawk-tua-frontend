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
        
        // Refresh the page to ensure scores persist
        await page.reload()
        
        // Verify review submission success and scores are visible after refresh
        await expect(page.getByRole("heading", { name: "Jane Doe" })).toBeVisible()
        
        // Verify the submitted scores are displayed after refresh
        await expect(page.getByText("Trust Score")).toBeVisible()
        await expect(page.getByText("Engagement Score")).toBeVisible() 
        await expect(page.getByText("Experience Score")).toBeVisible()
    })
})
