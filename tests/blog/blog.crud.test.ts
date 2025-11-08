import { test, expect } from '@playwright/test';
import { delay } from 'framer-motion';
import { browser } from 'process';

test.describe.serial('Test Blog functionality',()=>{

  test.beforeEach(async ({page}, testInfo)=>{
    if (testInfo.title === 'View another user blog') {
      return; // Skip login
    }

    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: '✨ Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Email' }).fill('jirapat.dkk@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Letmein@2547');
    await page.getByRole('button', { name: '✨ Sign In & Explore' }).click();
    await page.waitForTimeout(3000);
  })

  test('Can Create Blog', async ({ page }) => {
    await page.goto('http://localhost:3000/home');
    await page.getByRole('link', { name: 'Blog' }).click();
    await page.getByRole('button', { name: 'Write your story' }).click();
    await page.getByRole('link', { name: 'Create Blog' }).click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('FLAG1');
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('FLAG2');
    await page.getByRole('button', { name: '🌊 Sea' }).click();
    await page.getByRole('button', { name: '💧 Waterfall' }).click();
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
    await page.getByLabel('Main content area, start').fill('Uma Musume Trip to Tokyo Racecourse\n\nWe gathered the squad for a dream-like day at the racecourse, cheering on our favorite “horse girls” and soaking in the atmosphere!\n\nFLAG3');
    await page.getByRole('button', { name: 'Submit / Edit' }).click();
    await expect.poll(async () => {
        const itmCount = await page.getByRole('article').count();
        return itmCount;
    }).toBeGreaterThanOrEqual(1)
    await expect(page.getByRole('article').last()).toContainText('FLAG1');
    await expect(page.getByRole('article').last()).toContainText('FLAG2');
    await page.getByRole('article').last().click();
    await expect(page.getByLabel('Main content area, start')).toContainText('FLAG3')
  });
  
  test('Can Edit Blog', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Title' }).fill('FLAG1-edited');
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('FLAG2-edited');
    await page.getByLabel('Main content area, start').fill('Uma Musume Trip to Tokyo Racecourse\n\nWe gathered the squad for a dream-like day at the racecourse, cheering on our favorite “horse girls” and soaking in the atmosphere!\n\nFLAG3-edited');
    await page.getByRole('button', { name: 'Submit / Edit' }).click();
    await page.getByRole('link', { name: 'Blog' }).click();
    await page.getByRole('button', { name: 'Write your story' }).click();
    await expect(page.getByRole('article')).toContainText('FLAG1-edited');
    await expect(page.getByRole('article')).toContainText('FLAG2-edited');
    await page.getByRole('article').last().click();
    await expect(page.getByLabel('Main content area, start')).toContainText('FLAG3-edited');
  });

  test('View another user blog and like it', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: '✨ Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Email' }).fill('test@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Letmein@2547');
    await page.getByRole('button', { name: '✨ Sign In & Explore' }).click();
    await page.getByRole('link', { name: 'Blog' }).click();
    await page.getByText('GeneralFLAG1-editedFLAG2-').hover();
    await page.locator('.w-8.h-8.bg-orange-500\\/80').first().click();
    await page.getByLabel('Like').click();
  });
  
  test('Can Delete Blog', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('article')).toHaveCount(0);
  });

  
})
