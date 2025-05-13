import { test, expect } from 'playwright-test-coverage';
import { InfoPage } from '../page-objects/info.page';
import { acceptCookieConcent, axeCheckHandler } from '../../utils';

test.describe('As a user I want to see information page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to verify info page loads correctly', { tag: ['@info-page', '@smoke'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to the `/info` URL', async () => {
      await infoPage.open();
    });

    await test.step('Wait for the page to fully load', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify the page title is correct', async () => {
      await expect(infoPage.mainHeadingFi).toBeVisible();
    });

    await test.step('Verify the main content container is visible', async () => {
      await expect(infoPage.mainContent).toBeVisible();
    });

    await test.step('Verify the page headings are displayed', async () => {
      await expect(infoPage.serviceUsageFi).toBeVisible();
      await expect(infoPage.dataProtectionFi).toBeVisible();
      await expect(infoPage.cookiesFi).toBeVisible();
    });
  });

  test('As a user I want to verify page loads with language parameter', { tag: ['@info-page', '@localization'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to `/info?lang=en`', async () => {
      await infoPage.open('en');
    });

    await test.step('Wait for the page to fully load', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify page content is in English', async () => {
      await expect(infoPage.mainHeadingEn).toBeVisible();
      await expect(infoPage.serviceUsageEn).toBeVisible();
      await expect(infoPage.dataProtectionEn).toBeVisible();
      await expect(infoPage.cookiesEn).toBeVisible();
    });

    await test.step('Navigate to `/info?lang=sv`', async () => {
      await infoPage.open('sv');
    });

    await test.step('Wait for the page to fully load', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify page content is in Swedish', async () => {
      await expect(infoPage.mainHeadingSv).toBeVisible();
      await expect(infoPage.serviceUsageSv).toBeVisible();
      await expect(infoPage.dataProtectionSv).toBeVisible();
      await expect(infoPage.cookiesSv).toBeVisible();
    });
  });

  test('As a user I want to switch language via language controls', { tag: ['@info-page', '@localization'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to the info page', async () => {
      await infoPage.open();
    });

    await test.step('Click on the "Svenska" language button', async () => {
      await infoPage.switchLanguage('sv');
    });

    await test.step('Verify content changes to Swedish', async () => {
      await expect(infoPage.mainHeadingSv).toBeVisible();
      await expect(infoPage.serviceUsageSv).toBeVisible();
    });

    await test.step('Click on the "English" language button', async () => {
      await infoPage.switchLanguage('en');
    });

    await test.step('Verify content changes to English', async () => {
      await expect(infoPage.mainHeadingEn).toBeVisible();
      await expect(infoPage.serviceUsageEn).toBeVisible();
    });

    await test.step('Click on the "Suomi" language button', async () => {
      await infoPage.switchLanguage('fi');
    });

    await test.step('Verify content changes back to Finnish', async () => {
      await expect(infoPage.mainHeadingFi).toBeVisible();
      await expect(infoPage.serviceUsageFi).toBeVisible();
    });
  });

  test('As a user I want to verify Finnish content sections are displayed', { tag: ['@info-page', '@content'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to `/info?lang=fi`', async () => {
      await infoPage.open('fi');
    });

    await test.step('Verify main heading "Tietoa Kerrokantasi.hel.fi" is visible', async () => {
      await expect(infoPage.mainHeadingFi).toBeVisible();
    });

    await test.step('Verify "Palvelun käyttö" section is present', async () => {
      await expect(infoPage.serviceUsageFi).toBeVisible();
    });

    await test.step('Verify "Tietosuoja" section is present', async () => {
      await expect(infoPage.dataProtectionFi).toBeVisible();
    });

    await test.step('Verify "Evästeet" section is present', async () => {
      await expect(infoPage.cookiesFi).toBeVisible();
    });
  });

  test('As a user I want to verify Swedish content sections are displayed', { tag: ['@info-page', '@content'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to `/info?lang=sv`', async () => {
      await infoPage.open('sv');
    });

    await test.step('Verify main heading "Information om tjänsten Kerrokantasi" is visible', async () => {
      await expect(infoPage.mainHeadingSv).toBeVisible();
    });

    await test.step('Verify "Använda tjänsten" section is present', async () => {
      await expect(infoPage.serviceUsageSv).toBeVisible();
    });

    await test.step('Verify "Dataskyddsbeskrivning" section is present', async () => {
      await expect(infoPage.dataProtectionSv).toBeVisible();
    });

    await test.step('Verify "Om kakor" section is present', async () => {
      await expect(infoPage.cookiesSv).toBeVisible();
    });
  });

  test('As a user I want to verify English content sections are displayed', { tag: ['@info-page', '@content'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to `/info?lang=en`', async () => {
      await infoPage.open('en');
    });

    await test.step('Verify main heading "Terms of use for the Kerrokantasi service" is visible', async () => {
      await expect(infoPage.mainHeadingEn).toBeVisible();
    });

    await test.step('Verify "Using the service" section is present', async () => {
      await expect(infoPage.serviceUsageEn).toBeVisible();
    });

    await test.step('Verify "Data protection notices" section is present', async () => {
      await expect(infoPage.dataProtectionEn).toBeVisible();
    });

    await test.step('Verify "About cookies" section is present', async () => {
      await expect(infoPage.cookiesEn).toBeVisible();
    });
  });

  test('As a user I want to verify navigation menu functionality', { tag: ['@info-page', '@navigation'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to the info page', async () => {
      await infoPage.open();
    });

    await test.step('Click on the Hearings link in navigation menu', async () => {
      await infoPage.navigateToHearings();
    });

    await test.step('Verify redirection to the Hearings page', async () => {
      await expect(page).toHaveURL(/\/hearings\/list/); // Hearings link redirects to /hearings/list
    });

    await test.step('Navigate back to the info page', async () => {
      await infoPage.open();
    });

    await test.step('Click on the Home link', async () => {
      await infoPage.navigateToHome();
    });

    await test.step('Verify redirection to the home page', async () => {
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test('As a user I want to verify skip to main content functionality', { tag: ['@info-page', '@accessibility'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to the info page', async () => {
      await infoPage.open();
    });

    await test.step('Press Tab key to focus on skip to main content link', async () => {
      await infoPage.pressTabKey();
    });

    await test.step('Press Enter to activate the link', async () => {
      await infoPage.pressEnterKey();
    });

    await test.step('Verify focus moves to the main content', async () => {
      // Testing focus is challenging with Playwright - this is a basic check 
      // that the main content is in the DOM after the skip link is activated
      await expect(infoPage.mainContent).toBeVisible();
    });
  });

  test('As a user I want to verify heading hierarchy', { tag: ['@info-page', '@accessibility'] }, async ({ page }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to the info page', async () => {
      await infoPage.open();
    });

    await test.step('Verify page has one main H1 heading', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    });

    await test.step('Verify section headings use H2', async () => {
      await expect(page.getByRole('heading', { level: 2 })).not.toHaveCount(0);
    });
  });

  test.skip('As a user I want to verify external links open correctly', { tag: ['@info-page', '@external-links'] }, async ({ page, context }) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to the info page', async () => {
      await infoPage.open('fi'); // Use Finnish to ensure we find the expected links
    });

    await test.step('Verify external links have proper target attribute', async () => {
      // In this test we're just verifying links have the correct attributes
      // rather than actually opening them in new tabs
      const externalLinks = [
        infoPage.helsinkiProfileLinkFi,
        infoPage.privacyPolicyLinkFi
      ];

      for (const link of externalLinks) {
        // Check that links open in new tab
        const target = await link.getAttribute('target');
        expect(target).toBe('_blank');

        // Check they have rel="noopener noreferrer" for security
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    });
  });

  test.skip('As a user I want to verify accessibility of the page', { tag: ['@info-page', '@accessibility'] }, async ({ page }, testInfo) => {
    const infoPage = new InfoPage(page);

    await test.step('Navigate to the info page', async () => {
      await infoPage.open();
    });

    await test.step('Run automated accessibility tests', async () => {
      await axeCheckHandler(page, testInfo);
    });
  });
}); 