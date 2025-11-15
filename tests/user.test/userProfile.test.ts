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
        
        // Refresh the page to ensure scores persist
        await page.reload()
        
        // Verify review submission success and scores are visible after refresh
        await expect(page.getByRole("heading", { name: "Jane Doe" })).toBeVisible()
        
        // Verify the submitted scores are displayed after refresh
        await expect(page.getByText("Trust Score")).toBeVisible()
        await expect(page.getByText("Engagement Score")).toBeVisible() 
        await expect(page.getByText("Experience Score")).toBeVisible()

        
    })

    test('Travel History', async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole('button', { name: 'J', exact: true }).click();
        await page.getByRole('menuitem', { name: 'Your Profile' }).click();
        await expect(page.getByRole('heading', { name: 'Travel History' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Samyan' })).toBeVisible();
    });

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
