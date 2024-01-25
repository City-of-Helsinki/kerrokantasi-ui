import { expect, test } from '@playwright/test';

test.describe('Info page', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/info?lang=fi');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Title', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Tietoa palvelusta');
  });

  test('Headings', async () => {
    await expect(page.getByRole('heading', { name: 'Tietoa Kerrokantasi.hel.fi' })).toBeVisible();
  });
});
