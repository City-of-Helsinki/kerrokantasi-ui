import { expect, test } from '@playwright/test';

test.describe('Frontpage', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Title', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Kerrokantasi');
  });

  test('Map', async () => {
    await expect(page.locator('.map')).toBeVisible();
    await expect.soft(page.getByRole('heading', { name: 'Käynnissä olevat kuulemiset kartalla' })).toBeVisible();

    // Controls
    await expect.soft(page.getByLabel('Zoom in')).toBeEnabled();
    await expect.soft(page.getByLabel('Zoom out')).toBeEnabled();
  });

  test('Footer', async () => {
    await expect.soft(page.getByRole('link', { name: 'Kerro kantasi -kehitysideat' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Anna palautetta' })).toBeVisible();

    await expect.soft(page.getByRole('link', { name: 'Saavutettavuusseloste' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Tietosuoja' })).toBeVisible();
    await expect.soft(page.getByRole('contentinfo').getByRole('link', { name: 'Tietoa palvelusta' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Takaisin ylös' })).toBeVisible();
  });

  test('Header', async () => {
    // Action bar
    await expect.soft(page.getByRole('button', { name: 'Suomi', exact: true })).toBeEnabled();
    await expect.soft(page.getByRole('button', { name: 'Svenska' })).toBeEnabled();
    await expect.soft(page.getByRole('button', { name: 'English' })).toBeEnabled();
    await expect.soft(page.getByRole('button', { name: 'Kirjaudu' })).toBeEnabled();

    // Navbar
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Kuulemiset' })).toBeVisible();
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Kartta' })).toBeVisible();
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Tietoa palvelusta' })).toBeVisible();
  });
});
