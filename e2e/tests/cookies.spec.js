import { test, expect } from 'playwright-test-coverage';

test('Cookie banner', async ({ page }) => {
  await page.goto('/');

  const languageSwitcher = page.getByTestId('cookie-consent-language-switcher');

  // Buttons
  await expect.soft(page.getByTestId('cookie-consent-approve-button')).toBeVisible();
  await expect.soft(page.getByTestId('cookie-consent-approve-required-button')).toBeVisible();
  await expect.soft(page.getByTestId('cookie-consent-settings-toggler')).toBeVisible();

  // Change language
  await languageSwitcher.click();
  await page.getByTestId('cookie-consent-language-option-sv').click();
  await expect.soft(page.getByRole('heading', { name: 'Kerrokantasi använder kakor' })).toBeVisible();

  await languageSwitcher.click();
  await page.getByTestId('cookie-consent-language-option-en').click();
  await expect.soft(page.getByRole('heading', { name: 'Kerrokantasi uses cookies' })).toBeVisible();

  await languageSwitcher.click();
  await page.getByTestId('cookie-consent-language-option-fi').click();
  await expect.soft(page.getByRole('heading', { name: 'Kerrokantasi käyttää evästeitä' })).toBeVisible();

  // Accept cookies
  await page.getByTestId('cookie-consent-approve-required-button').click();
  await expect.soft(page.getByTestId('html-cookie-consent-container')).toBeHidden();
});
