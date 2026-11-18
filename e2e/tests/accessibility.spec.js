import { expect, test } from '@playwright/test';

import { checkA11y } from '../a11y/checkA11y.ts';

/*
 * Accessibility checks for pages available without login. Logged-in pages need test users per
 * role and are added once the common test login exists.
 *
 * The app runs against the shared dev Kerrokantasi API. Hearing scans use the dedicated e2e
 * hearing; nothing is submitted.
 */

const E2E_HEARING = '/kuuleminen-e2e-testausta-varten';

/**
 * Opens a page, accepts the required cookies and waits until the page content has loaded. Waits
 * for the app's main container: some pages nest another main element inside it.
 */
const openPage = async (
  page,
  path,
  ready = (p) => p.locator('#main-container')
) => {
  await page.goto(path);
  await page.locator('button[data-approved="required"]').click();
  await expect(page.locator('div#hds-cc')).toBeHidden();
  await expect(ready(page)).toBeVisible();
  await page.waitForLoadState('networkidle');
};

const hearingReady = (page) => page.locator('.hearing-header-title');

/*
 * Axe scans run in Chromium only: results can differ slightly between browser engines, and the
 * baseline is shared per scan. Keyboard behaviour is tested in every configured browser.
 */
test.describe('Accessibility scans', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'axe scans run in Chromium only'
  );

  test('front page with cookie consent', async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(page.locator('button[data-approved="all"]')).toBeVisible();

    await checkA11y(page, testInfo, 'front page with cookie consent');
  });

  for (const lang of ['fi', 'sv', 'en']) {
    test(`front page (${lang})`, async ({ page }, testInfo) => {
      await openPage(page, `/?lang=${lang}`);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);

      await checkA11y(page, testInfo, `front page (${lang})`);
    });
  }

  test('hearing list', async ({ page }, testInfo) => {
    await openPage(page, '/hearings/list?lang=fi', (p) =>
      p.getByRole('heading', { name: 'Kaikki kuulemiset' })
    );

    await checkA11y(page, testInfo, 'hearing list');
  });

  test('hearing map', async ({ page }, testInfo) => {
    await openPage(page, '/hearings/map?lang=fi', (p) =>
      p.locator('.leaflet-container')
    );

    await checkA11y(page, testInfo, 'hearing map');
  });

  test('hearing', async ({ page }, testInfo) => {
    await openPage(page, `${E2E_HEARING}?lang=fi`, hearingReady);

    await checkA11y(page, testInfo, 'hearing');
  });

  test('hearing with comment form open', async ({ page }, testInfo) => {
    await openPage(page, `${E2E_HEARING}?lang=fi`, hearingReady);
    await page.locator('.comment-form-container button').first().click();
    await expect(page.locator('.comment-form textarea').first()).toBeVisible();

    await checkA11y(page, testInfo, 'hearing with comment form open');
  });

  test('hearing subsection', async ({ page }, testInfo) => {
    await openPage(page, `${E2E_HEARING}?lang=fi`, hearingReady);
    const sectionButton = page.locator('.section-card button').first();
    test.skip(
      (await sectionButton.count()) === 0,
      'The e2e hearing has no subsections'
    );
    await sectionButton.click();
    await page.waitForLoadState('networkidle');

    await checkA11y(page, testInfo, 'hearing subsection');
  });

  test('hearing not found', async ({ page }, testInfo) => {
    await openPage(page, '/this-hearing-does-not-exist?lang=fi');

    await checkA11y(page, testInfo, 'hearing not found');
  });

  test('info page', async ({ page }, testInfo) => {
    await openPage(page, '/info?lang=fi');

    await checkA11y(page, testInfo, 'info page');
  });

  test('cookie settings', async ({ page }, testInfo) => {
    await openPage(page, '/cookies?lang=fi');

    await checkA11y(page, testInfo, 'cookie settings');
  });

  test.describe('mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('mobile menu open', async ({ page }, testInfo) => {
      await openPage(page, '/?lang=fi');
      await page.getByRole('button', { name: /valikko|menu/i }).click();
      await expect(
        page.getByRole('link', { name: 'Kuulemiset' }).first()
      ).toBeVisible();

      await checkA11y(page, testInfo, 'mobile menu open');
    });
  });
});

test.describe('Keyboard', () => {
  test('skip link moves focus to the main content', async ({ page }) => {
    await openPage(page, '/?lang=fi');
    // Accepting the cookie banner moves focus into the page; start from a fresh load instead.
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Siirry pääsisältöön' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect
      .poll(() =>
        page.evaluate(() => !!document.activeElement?.closest('main'))
      )
      .toBe(true);
  });

  test('language can be changed with the keyboard', async ({ page }) => {
    await openPage(page, '/?lang=fi');
    await page.getByRole('button', { name: 'Svenska' }).focus();

    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
  });
});
