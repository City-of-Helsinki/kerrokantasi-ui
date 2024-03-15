import { test, expect } from '@playwright/test';

test.describe('Map Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hearings/map?lang=fi');
  });

  test('should display heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Kaikki kuulemiset' })).toBeVisible();
  });

  test('should display "Etsi otsikoista" combobox', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: 'Etsi otsikoista' })).toBeVisible();
  });

  test('should display "Etsi..." text', async ({ page }) => {
    await expect(page.getByText('Etsi...')).toBeVisible();
  });

  test('should display "Etsi" button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Etsi', exact: true })).toBeVisible();
  });

  test('should display "Näytetään vain avoimet" text', async ({ page }) => {
    await expect(page.getByText('Näytetään vain avoimet')).toBeVisible();
  });

  test('should display "Kartta" tab', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Kartta' })).toBeVisible();
  });

  test('should display "Lista" tab', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Lista' })).toBeVisible();
  });

  test('swedish translations', async ({ page }) => {
    await page.goto('/hearings/map?lang=sv');
    await expect.soft(page.getByRole('heading', { name: 'Alla höranden' })).toBeVisible();
    await expect.soft(page.getByText('Endast öppna visas')).toBeVisible();
    await expect.soft(page.getByRole('combobox', { name: 'Sök bland rubrikerna' })).toBeVisible();
  });

  test('english translations', async ({ page }) => {
    await page.goto('/hearings/map?lang=en');
    await expect.soft(page.getByRole('heading', { name: 'All hearings' })).toBeVisible();
    await expect.soft(page.getByText('Show only open')).toBeVisible();
    await expect.soft(page.getByRole('combobox', { name: 'Search from titles' })).toBeVisible();
  });
});
