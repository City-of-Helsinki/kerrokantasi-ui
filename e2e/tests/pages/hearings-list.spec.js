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

  test('should have search controls visibility', async () => {
    await expect.soft(page.getByText('Etsi otsikoista')).toBeVisible();
    await expect.soft(page.getByText('Hae aiheista')).toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Etsi', exact: true })).toBeEnabled();
  });

  test('should perform a search', async () => {
    const searchTextInput = page.getByRole('combobox', { name: 'Etsi otsikoista' });

    // Check the default state of the select input
    const input = page.locator('#formControlsSearchSelect');
    await expect.soft(input).toHaveValue('');

    // Perform a search and validate the input value
    const SEARCH_TEXT = 'Hello';
    await searchTextInput.fill(SEARCH_TEXT);
    await expect(searchTextInput).toHaveValue(SEARCH_TEXT);
  });

  test('swedish translations', async () => {
    await page.goto('/hearings/list?lang=sv');

    await expect(page).toHaveTitle(/.*Alla höranden/);
    await expect(page.getByRole('heading', { name: 'Alla höranden' })).toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Sök', exact: true })).toBeEnabled();
    await expect.soft(page.getByText('Sök bland rubrikerna')).toBeVisible();
    await expect.soft(page.getByText('Sök bland ämnena')).toBeVisible();
  });

  test('english translations', async () => {
    await page.goto('/hearings/list?lang=en');

    await expect(page).toHaveTitle(/.*All hearings/);
    await expect(page.getByRole('heading', { name: 'All hearings' })).toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Search', exact: true })).toBeEnabled();
    await expect.soft(page.getByText('Search from titles')).toBeVisible();
    await expect.soft(page.getByText('Search labels')).toBeVisible();
  });
});
