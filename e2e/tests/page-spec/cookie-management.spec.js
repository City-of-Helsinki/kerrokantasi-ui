import { test, expect } from 'playwright-test-coverage';
import { CookieManagementPage } from '../page-objects/cookie-management.page';
import { acceptCookieConcent } from '../../utils';

test.describe('As a user I want to manage cookie settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to navigate to Cookie Management page', { tag: ['@cookie-management', '@smoke'] }, async ({ page }) => {
    const cookieManagementPage = new CookieManagementPage(page);

    await test.step('Navigate to the application\'s home page', async () => {
      await page.goto('/');
    });

    await test.step('Navigate to the /cookies URL', async () => {
      await cookieManagementPage.navigateToCookiesPage();
    });

    await test.step('Observe the page content', async () => {
      await expect(cookieManagementPage.headingFi).toBeVisible();
      await expect(cookieManagementPage.sectionHeadingFi).toBeVisible();
      await expect(cookieManagementPage.necessaryCookiesFi).toBeVisible();
      await expect(cookieManagementPage.statisticsCookiesFi).toBeVisible();
    });
  });

  test('As a user I want to switch language on Cookie Management page', { tag: ['@cookie-management', '@language'] }, async ({ page }) => {
    const cookieManagementPage = new CookieManagementPage(page);

    await test.step('Navigate to the Cookie Management page', async () => {
      await cookieManagementPage.navigateToCookiesPage();
    });

    await test.step('Identify the language switcher', async () => {
      await expect(cookieManagementPage.finnishButton).toBeVisible();
      await expect(cookieManagementPage.swedishButton).toBeVisible();
      await expect(cookieManagementPage.englishButton).toBeVisible();
    });

    await test.step('Change the language to Swedish', async () => {
      await cookieManagementPage.switchLanguage('swedish');
    });

    await test.step('Observe that the content changes to Swedish', async () => {
      await expect(cookieManagementPage.headingSv).toBeVisible();
      await expect(cookieManagementPage.sectionHeadingSv).toBeVisible();
    });

    await test.step('Change the language to English', async () => {
      await cookieManagementPage.switchLanguage('english');
    });

    await test.step('Observe that the content changes to English', async () => {
      await expect(cookieManagementPage.headingEn).toBeVisible();
      await expect(cookieManagementPage.sectionHeadingEn).toBeVisible();
    });

    await test.step('Change the language to Finnish', async () => {
      await cookieManagementPage.switchLanguage('finnish');
    });

    await test.step('Observe that the content changes to Finnish', async () => {
      await expect(cookieManagementPage.headingFi).toBeVisible();
      await expect(cookieManagementPage.sectionHeadingFi).toBeVisible();
    });
  });

  test('As a user I want to toggle cookie preferences', { tag: ['@cookie-management', '@preferences'] }, async ({ page }) => {
    const cookieManagementPage = new CookieManagementPage(page);

    await test.step('Navigate to the Cookie Management page', async () => {
      await cookieManagementPage.navigateToCookiesPage();
      await cookieManagementPage.switchLanguage('english');
    });

    await test.step('Locate the statistics cookie toggle (Matomo)', async () => {
      await expect(cookieManagementPage.statisticsCookiesEn).toBeVisible();
    });

    await test.step('If currently enabled, disable the statistics cookie', async () => {
      await cookieManagementPage.toggleStatisticsCookies(false);
    });

    await test.step('Save preferences', async () => {
      await cookieManagementPage.savePreferences();
    });

    await test.step('Verify the setting is saved (cookie is updated)', async () => {
      await expect(cookieManagementPage.savedNotificationHeading).toBeVisible();
      await expect(cookieManagementPage.statisticsCookiesEn).not.toBeChecked();
    });

    await test.step('Enable the statistics cookie', async () => {
      await cookieManagementPage.toggleStatisticsCookies(true);
    });

    await test.step('Save preferences', async () => {
      await cookieManagementPage.savePreferences();
    });

    await test.step('Verify the setting is saved (cookie is updated)', async () => {
      await expect(cookieManagementPage.savedNotificationHeading).toBeVisible();
      await expect(cookieManagementPage.statisticsCookiesEn).toBeChecked();
    });
  });

  test('As a user I want to view cookie policy information', { tag: ['@cookie-management', '@information'] }, async ({ page }) => {
    const cookieManagementPage = new CookieManagementPage(page);

    await test.step('Navigate to the Cookie Management page', async () => {
      await cookieManagementPage.navigateToCookiesPage();
      await cookieManagementPage.switchLanguage('english');
    });

    await test.step('Observe the content sections for different cookie categories', async () => {
      await expect(cookieManagementPage.sectionHeadingEn).toBeVisible();
    });

    await test.step('Verify that essential cookies information is available', async () => {
      await expect(cookieManagementPage.necessaryCookiesEn).toBeVisible();
      await expect(cookieManagementPage.sharedConsentEn).toBeVisible();
    });

    await test.step('Verify that statistics cookies (Matomo) information is available', async () => {
      await expect(cookieManagementPage.statisticsCookiesEn).toBeVisible();
      await expect(cookieManagementPage.statisticsInfoButtonEn).toBeVisible();
    });
  });
}); 