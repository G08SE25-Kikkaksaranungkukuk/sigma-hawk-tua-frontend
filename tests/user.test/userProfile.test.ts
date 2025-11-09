import { test, expect } from "@playwright/test"
import { TEST_USERS_DATA, TestGroup } from "../setup/db-seeding"

test("user can view other user's profile", async ({ page }) => {
    const testUser = TEST_USERS_DATA.testUser2
    await page.goto("/")
    await page.getByRole("link", { name: "✨ Sign In" }).click()
    await page.getByRole("textbox", { name: "Email" }).click()
    await page.getByRole("textbox", { name: "Email" }).fill(testUser.email)
    await page.getByRole("textbox", { name: "Password" }).click()
    await page
        .getByRole("textbox", { name: "Password" })
        .fill(testUser.password)
    await page.getByRole("button", { name: "✨ Sign In & Explore" }).click()
    await page.getByRole("button", { name: "View" }).click()
    await page.getByRole("img", { name: "Jo Chanah" }).click()
    await expect(page.getByRole("heading", { name: "Jo Chanah" })).toBeVisible()
    await expect(page.getByText("jotest11@gmail.com")).toBeVisible()
    await expect(page.getByText("0812345678")).toBeVisible()
})
test("user can update profile successfully", async ({ page }) => {
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
    await page.getByRole("menuitem", { name: "Your Profile" }).click()
    await page.getByRole("button", { name: "Back" }).click()
    await page.getByRole("button", { name: "J", exact: true }).click()
    await page.getByRole("menuitem", { name: "Profile Management" }).click()
    await page.getByRole("textbox", { name: "👤 First Name *" }).click()
    await page.getByRole("textbox", { name: "👤 First Name *" }).click()
    await page
        .getByRole("textbox", { name: "👤 First Name *" })
        .fill("jacky123")
    await page.getByRole("textbox", { name: "👤 Last Name *" }).click()
    await page.getByRole("textbox", { name: "👤 Last Name *" }).fill("Chanahhh")
    await page
        .getByRole("textbox", { name: "👤 Middle Name (optional)" })
        .click()
    await page
        .getByRole("textbox", { name: "👤 Middle Name (optional)" })
        .fill("What")
    await page.getByRole("button", { name: "🏖️ Sea & Beach" }).click()
    await page.getByRole("button", { name: "⛰️ Mountain & Hills" }).click()
    await page.getByText("🏖️ Sea & Beach⛰️ Mountain &").click()
    await page.getByRole("button", { name: "💧 Waterfalls" }).click()
    await page.getByRole("button", { name: "🙏 Temples & Shrines" }).click()
    await page.getByRole("button", { name: "🏛️ Historical Sites" }).click()
    await page.getByRole("button", { name: "🏞️ National Parks" }).click()
    await page.getByRole("button", { name: "☕ Cafes & Coffee" }).click()
    await page.locator(".w-5.h-5.rounded").first().click()
    await page.locator("div:nth-child(2) > .relative > .w-5").click()
    await page.getByRole("textbox", { name: "📱 Phone Number *" }).click()
    await page.getByRole("textbox", { name: "📱 Phone Number *" }).click()
    await page
        .getByRole("textbox", { name: "📱 Phone Number *" })
        .fill("064-805-5426")
    await page.getByRole("textbox", { name: "📧 Email" }).click()
    await page.getByRole("button", { name: "Confirm Changes" }).click()
    await page
        .locator("div")
        .filter({ hasText: "Explore the WorldTHAM" })
        .nth(1)
        .click()
})

test("user cannot update profile with invalid data", async ({ page }) => {
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
    await page.getByRole("textbox", { name: "📱 Phone Number *" }).click()
    await page
        .getByRole("textbox", { name: "📱 Phone Number *" })
        .fill("064-905-")
    await expect(
        page.getByText(
            "Complete Required FieldsPlease fill all required fields correctly to continue"
        )
    ).toBeVisible()
    await page.locator("div:nth-child(2) > .relative > .w-5").click()
    await page.locator("div:nth-child(4) > .relative > .w-5").click()
    await page.getByRole("button", { name: "🏛️ Historical Sites" }).click()
    await page.getByRole("button", { name: "☕ Cafes & Coffee" }).click()
    await page.getByRole("button", { name: "🙏 Temples & Shrines" }).click()
    await page.getByRole("button", { name: "💧 Waterfalls" }).click()
    await page
        .getByText(
            "Complete Required FieldsPlease fill all required fields correctly to continue"
        )
        .click()
    await page.getByRole("textbox", { name: "👤 First Name *" }).dblclick()
    await page.getByRole("textbox", { name: "👤 First Name *" }).fill("")
    await page
        .getByText(
            "Complete Required FieldsPlease fill all required fields correctly to continue"
        )
        .click()
    await page.getByRole("textbox", { name: "👤 Last Name *" }).dblclick()
    await page.getByRole("textbox", { name: "👤 Last Name *" }).fill("")
    await page
        .getByText(
            "Complete Required FieldsPlease fill all required fields correctly to continue"
        )
        .click()
})
