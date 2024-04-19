import { expect, test } from '@playwright/test';

test.describe('Info page - Fi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/info?lang=fi');
  });

  test('Title', async ({ page }) => {
    await expect(page).toHaveTitle(/.*Tietoa palvelusta/);
  });

  test('Headings', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tietoa Kerrokantasi.hel.fi' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Palvelun käyttö' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tietosuoja' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Evästeet' })).toBeVisible();
  });
});

test.describe('Info page - Sv', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/info?lang=sv');
  });

  test('Title', async ({ page }) => {
    await expect(page).toHaveTitle(/.*Information om tjänsten/);
  });

  test('Headings', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Information om tjänsten Kerrokantasi' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Använda tjänsten' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dataskyddsbeskrivning' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Om kakor' })).toBeVisible();
  });
});

test.describe('Info page - En', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/info?lang=en');
  });

  test('Title', async ({ page }) => {
    await expect(page).toHaveTitle(/.*About service/);
  });

  test('Headings', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Terms of use for the Kerrokantasi service' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Using the service' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data protection notices' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'About cookies' })).toBeVisible();
  });
});
