import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA } from "../setup/db-seeding"
import { TestHelpers } from "../test-helpers"

test.describe.serial("Update User Profile Tests", () => {

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
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        
        await expect(page.getByRole('textbox', { name: '👤 First Name *' })).toHaveValue('jacky123');
        await expect(page.getByRole('textbox', { name: '👤 Middle Name (optional)' })).toHaveValue('What');
        await expect(page.getByRole('textbox', { name: '👤 Last Name *' })).toHaveValue('Chanahhh');
        await expect(page.getByRole('textbox', { name: '📱 Phone Number *' })).toHaveValue('064-805-5426');
        
    })

    test("user cannot update profile when firstname is empty", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        // Clear first name to trigger validation
        await page.getByRole("textbox", { name: "👤 First Name *" }).dblclick()
        await page.getByRole("textbox", { name: "👤 First Name *" }).fill("")

        // Check validation message appears
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()

    })

    test("user cannot update profile when lastname is empty", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        // Clear first name to trigger validation
        await page.getByRole("textbox", { name: "👤 Last Name *" }).dblclick()
        await page.getByRole("textbox", { name: "👤 Last Name *" }).fill("")

        // Check validation message appears
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()

    })

    test("user cannot update profile when phone number is empty", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        // Clear first name to trigger validation
        await page.getByRole("textbox", { name: "📱 Phone Number *" }).dblclick()
        await page.getByRole("textbox", { name: "📱 Phone Number *" }).fill("")

        // Check validation message appears
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()

        await page.getByRole("textbox", { name: "📱 Phone Number *" }).dblclick()
        await page.getByRole("textbox", { name: "📱 Phone Number *" }).fill("0458452")

        // Check validation message appears
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()
    })

    test("user cannot update profile when interest is not selected", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        // Clear interest to trigger validation. Before "SHOPPING_MALL", "CAFE", "FOOD_STREET"
        await page.getByRole('button', { name: '🛍️ Shopping Malls' }).click();
        await page.getByRole('button', { name: '☕ Cafes & Coffee' }).click();
        await page.getByRole('button', { name: '🍴 Food Streets' }).click();
        // Check validation message appears
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()
    })

    test("user cannot update profile when travel style is not selected", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser2
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        //travel_styles: before ["LUXURY", "COMFORT"],
        await page.getByText('🏨 Comfort Travel').click();
        await page.getByText('👑 Luxury Travel').click();

        // Check validation message appears
        await expect(
            page.getByText(
                "Complete Required FieldsPlease fill all required fields correctly to continue"
            )
        ).toBeVisible()
    })

    test("user can update profile when middlename is empty", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        // Clear first name to trigger validation
        await page.getByRole("textbox", { name: "👤 Middle Name (optional)" }).dblclick()
        await page.getByRole("textbox", { name: "👤 Middle Name (optional)" }).fill("")

        await page.getByRole("button", { name: "Confirm Changes" }).click()

        // Verify success
        await expect(page).toHaveURL("/home", { timeout: 10000 })
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        
        await expect(page.getByRole('textbox', { name: '👤 Middle Name (optional)' })).toHaveValue('');
    })

    test("user can update profile picture successfully", async ({ page }) => {
        const testUser = TEST_USERS_DATA.testUser1
        await TestHelpers.loginUser(page, testUser)
        await page.getByRole("button", { name: "J", exact: true }).click()
        await page.getByRole("menuitem", { name: "Profile Management" }).click()
        
        // Create a test image file for upload
        const testImagePath = './tests/assets/birdPic.jpg'
        
        // Click the camera button to trigger file upload
        const cameraButton = page.locator('button[title="Change profile picture"]')
        
        // Set up file chooser event handler before clicking the button
        const fileChooserPromise = page.waitForEvent('filechooser')
        await cameraButton.click()
        
        // Handle the file chooser dialog
        const fileChooser = await fileChooserPromise
        await fileChooser.setFiles(testImagePath)
        
        // Wait for crop modal to appear and crop the image
        await page.waitForSelector('text=Crop Your Image', { timeout: 10000 })
        
        // Click the crop button in the modal
        await page.getByRole('button', { name: 'Crop Image' }).click();
        
        await page.getByRole("button", { name: "Confirm Changes" }).click()

        // Verify success
        await expect(page).toHaveURL("/home", { timeout: 10000 })
    })
})
