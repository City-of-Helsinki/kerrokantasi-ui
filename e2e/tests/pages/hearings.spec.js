import { expect, test } from '@playwright/test';

test.describe('Hearing list page', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/hearings/list?lang=fi');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should have correct title', async () => {
    await expect(page).toHaveTitle(/.*kuulemiset/);
  });

  test('should display all headings', async () => {
    await expect(page.getByRole('heading', { name: 'Kaikki kuulemiset' })).toBeVisible();
  });

  test('should have search controls', async () => {
    const searchTextInput = page.getByRole('combobox', { name: 'Etsi otsikoista' });

    // Labels
    await expect.soft(page.getByText('Etsi otsikoista')).toBeVisible();
    await expect.soft(page.getByText('Hae aiheista')).toBeVisible();

    // Submit button
    await expect.soft(page.getByRole('button', { name: 'Etsi', exact: true })).toBeEnabled();

    // Check the default state of the select input
    const input = page.locator('#formControlsSearchSelect');
    await expect.soft(input).toHaveValue('');

    // Perform a search and validate the input value
    const SEARCH_TEXT = 'Hello';
    await searchTextInput.fill(SEARCH_TEXT);
    await expect(searchTextInput).toHaveValue(SEARCH_TEXT);
  });
});
