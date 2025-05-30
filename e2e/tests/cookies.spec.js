import { test, expect } from 'playwright-test-coverage';

test('Cookie banner', async ({ page }) => {
  await page.goto('/');

  // Buttons
  await expect.soft(page.locator('button[data-approved="all"]')).toBeVisible();
  await expect.soft(page.locator('button[data-approved="required"]')).toBeVisible();
  await expect.soft(page.locator('button[aria-controls="hds-cc-form"]')).toBeVisible();

  // Accept cookies
  await page.locator('button[data-approved="required"]').click();
  await expect.soft(page.locator('div#hds-cc')).toBeHidden();
});
