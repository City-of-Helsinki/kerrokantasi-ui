import { expect, test } from 'playwright-test-coverage';

test.describe('Frontpage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('page title', async ({ page }) => {
    await expect(page).toHaveTitle(/.*Kerrokantasi/);
  });

  test('map section', async ({ page }) => {
    await expect(page.locator('.map')).toBeVisible();
    await expect.soft(page.getByRole('heading', { name: 'Käynnissä olevat kuulemiset kartalla' })).toBeVisible();

    // Controls
    await expect.soft(page.getByLabel('Zoom in')).toBeEnabled();
    await expect.soft(page.getByLabel('Zoom out')).toBeEnabled();
  });

  test('footer section', async ({ page }) => {
    await expect.soft(page.getByRole('link', { name: 'Kerro kantasi -kehitysideat' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Anna palautetta' })).toBeVisible();

    await expect.soft(page.getByRole('link', { name: 'Saavutettavuusseloste' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Tietosuoja' })).toBeVisible();
    await expect.soft(page.getByRole('contentinfo').getByRole('link', { name: 'Tietoa palvelusta' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Takaisin ylös' })).toBeVisible();
  });

  test('header section', async ({ page }) => {
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

  test('swedish translations', async ({ page }) => {
    await page.goto('/?lang=sv');

    // Navbar
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Höranden' })).toBeVisible();
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Karta' })).toBeVisible();
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Information om tjänsten' })).toBeVisible();

    // Headings
    await expect.soft(page.locator('main')).toContainText('Säg din åsikt');
    await expect.soft(page.locator('main')).toContainText('Öppna höranden');
    await expect.soft(page.locator('main')).toContainText('Pågående höranden på kartan');

    // Footer
    await expect.soft(page.getByRole('link', { name: 'Ge respons' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Tillgänglighetsutlåtande' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Dataskydd' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Cookie -inställningar' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Tillbaka till toppen' })).toBeVisible();
  });

  test('english translations', async ({ page }) => {
    await page.goto('/?lang=en');

    // Navbar
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Hearings' })).toBeVisible();
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'Map' })).toBeVisible();
    await expect.soft(page.getByRole('list').getByRole('link', { name: 'About the service' })).toBeVisible();

    // Headings
    await expect.soft(page.locator('main')).toContainText('Voice your opinion');
    await expect.soft(page.locator('main')).toContainText('Open hearings');
    await expect.soft(page.locator('main')).toContainText('Open hearings on map');

    // Footer
    await expect.soft(page.getByRole('link', { name: 'Give feedback' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Accessibility Statement' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Data Protection' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Data Protection' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Back to top' })).toBeVisible();
  });
});
