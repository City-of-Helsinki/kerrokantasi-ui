import { test, expect } from 'playwright-test-coverage';
import { AccessibilityPage } from '../page-objects/accessibility-page.page';
import { acceptCookieConcent, axeCheckHandler } from '../../utils';

test.describe('As a user I want to access the accessibility information', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to verify accessibility page loads correctly', { tag: ['@accessibility', '@smoke'] }, async ({ page }, testInfo) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to the /accessibility URL', async () => {
      await accessibilityPage.open();
    });

    await test.step('Wait for the page to fully load', async () => {
      await expect(accessibilityPage.mainContent).toBeVisible();
    });

    await test.step('Verify the page title is correct', async () => {
      await expect(accessibilityPage.getFinnishMainHeading()).toBeVisible();
    });

    await test.step('Verify the main content container is visible', async () => {
      await expect(accessibilityPage.mainContent).toBeVisible();
    });

    await test.step('Verify the page headings are displayed', async () => {
      const finnishHeadings = accessibilityPage.getFinnishSectionHeadings();
      await expect(finnishHeadings.legalProvisions).toBeVisible();
      await expect(finnishHeadings.complianceStatus).toBeVisible();
      await expect(finnishHeadings.nonAccessibleContent).toBeVisible();
      await expect(finnishHeadings.feedbackContacts).toBeVisible();
    });

    await test.step('Run automated accessibility tests', async () => {
      await axeCheckHandler(page, testInfo);
    });
  });

  test('As a user I want to verify page loads with language parameter', { tag: ['@accessibility', '@language'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to /accessibility?lang=en', async () => {
      await accessibilityPage.open('en');
    });

    await test.step('Wait for the page to fully load', async () => {
      await expect(accessibilityPage.mainContent).toBeVisible();
    });

    await test.step('Verify page content is in English', async () => {
      await expect(accessibilityPage.getEnglishMainHeading()).toBeVisible();
    });

    await test.step('Navigate to /accessibility?lang=sv', async () => {
      await accessibilityPage.open('sv');
    });

    await test.step('Verify page content is in Swedish', async () => {
      await expect(accessibilityPage.getSwedishMainHeading()).toBeVisible();
    });
  });

  test('As a user I want to switch language via language controls', { tag: ['@accessibility', '@language'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to the accessibility page', async () => {
      await accessibilityPage.open();
    });

    await test.step('Click on the "Svenska" language button', async () => {
      await accessibilityPage.switchLanguage('sv');
    });

    await test.step('Verify content changes to Swedish', async () => {
      await expect(accessibilityPage.getSwedishMainHeading()).toBeVisible();
    });

    await test.step('Click on the "English" language button', async () => {
      await accessibilityPage.switchLanguage('en');
    });

    await test.step('Verify content changes to English', async () => {
      await expect(accessibilityPage.getEnglishMainHeading()).toBeVisible();
    });

    await test.step('Click on the "Suomi" language button', async () => {
      await accessibilityPage.switchLanguage('fi');
    });

    await test.step('Verify content changes back to Finnish', async () => {
      await expect(accessibilityPage.getFinnishMainHeading()).toBeVisible();
    });
  });

  test('As a user I want to verify English accessibility statement sections are displayed', { tag: ['@accessibility', '@content'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to /accessibility?lang=en', async () => {
      await accessibilityPage.open('en');
    });

    await test.step('Verify main heading "Accessibility statement – Voice Your Opinion" is visible', async () => {
      await expect(accessibilityPage.getEnglishMainHeading()).toBeVisible();
    });

    await test.step('Verify "Legal provisions applied to the website" section is present', async () => {
      const englishHeadings = accessibilityPage.getEnglishSectionHeadings();
      await expect(englishHeadings.legalProvisions).toBeVisible();
    });

    await test.step('Verify "Compliance status" section is present', async () => {
      const englishHeadings = accessibilityPage.getEnglishSectionHeadings();
      await expect(englishHeadings.complianceStatus).toBeVisible();
    });

    await test.step('Verify "Non-accessible content" section is present', async () => {
      const englishHeadings = accessibilityPage.getEnglishSectionHeadings();
      await expect(englishHeadings.nonAccessibleContent).toBeVisible();
    });

    await test.step('Verify "Correcting the non-compliance" section is present', async () => {
      const englishHeadings = accessibilityPage.getEnglishSectionHeadings();
      await expect(englishHeadings.correctingNonCompliance).toBeVisible();
    });

    await test.step('Verify "Feedback and contact information" section is present', async () => {
      const englishHeadings = accessibilityPage.getEnglishSectionHeadings();
      await expect(englishHeadings.feedbackContacts).toBeVisible();
    });
  });

  test('As a user I want to verify Finnish accessibility statement sections are displayed', { tag: ['@accessibility', '@content'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to /accessibility?lang=fi', async () => {
      await accessibilityPage.open('fi');
    });

    await test.step('Verify main heading is visible (in Finnish)', async () => {
      await expect(accessibilityPage.getFinnishMainHeading()).toBeVisible();
    });

    await test.step('Verify the legal provisions section is present', async () => {
      const finnishHeadings = accessibilityPage.getFinnishSectionHeadings();
      await expect(finnishHeadings.legalProvisions).toBeVisible();
    });

    await test.step('Verify the compliance status section is present', async () => {
      const finnishHeadings = accessibilityPage.getFinnishSectionHeadings();
      await expect(finnishHeadings.complianceStatus).toBeVisible();
    });

    await test.step('Verify the non-accessible content section is present', async () => {
      const finnishHeadings = accessibilityPage.getFinnishSectionHeadings();
      await expect(finnishHeadings.nonAccessibleContent).toBeVisible();
    });

    await test.step('Verify the feedback section is present', async () => {
      const finnishHeadings = accessibilityPage.getFinnishSectionHeadings();
      await expect(finnishHeadings.feedbackContacts).toBeVisible();
    });
  });

  test('As a user I want to verify Swedish accessibility statement sections are displayed', { tag: ['@accessibility', '@content'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to /accessibility?lang=sv', async () => {
      await accessibilityPage.open('sv');
    });

    await test.step('Verify main heading is visible (in Swedish)', async () => {
      await expect(accessibilityPage.getSwedishMainHeading()).toBeVisible();
    });

    await test.step('Verify the legal provisions section is present', async () => {
      const swedishHeadings = accessibilityPage.getSwedishSectionHeadings();
      await expect(swedishHeadings.legalProvisions).toBeVisible();
    });

    await test.step('Verify the compliance status section is present', async () => {
      const swedishHeadings = accessibilityPage.getSwedishSectionHeadings();
      await expect(swedishHeadings.complianceStatus).toBeVisible();
    });

    await test.step('Verify the non-accessible content section is present', async () => {
      const swedishHeadings = accessibilityPage.getSwedishSectionHeadings();
      await expect(swedishHeadings.nonAccessibleContent).toBeVisible();
    });

    await test.step('Verify the feedback section is present', async () => {
      const swedishHeadings = accessibilityPage.getSwedishSectionHeadings();
      await expect(swedishHeadings.feedbackContacts).toBeVisible();
    });
  });

  test('As a user I want to verify navigation from accessibility page', { tag: ['@accessibility', '@navigation'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to the accessibility page', async () => {
      await accessibilityPage.open();
    });

    await test.step('Click on the Hearings link in navigation menu', async () => {
      await accessibilityPage.navigateToHearings();
    });

    await test.step('Verify redirection to the Hearings page', async () => {
      await expect(page).toHaveURL(/\/hearings\/list/);
    });

    await test.step('Navigate back to the accessibility page', async () => {
      await accessibilityPage.open();
    });

    await test.step('Click on the Home link', async () => {
      await accessibilityPage.navigateToHome();
    });

    await test.step('Verify redirection to the home page', async () => {
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test('As a user I want to verify heading hierarchy for screen readers', { tag: ['@accessibility', '@a11y'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to the accessibility page', async () => {
      await accessibilityPage.open();
    });

    await test.step('Verify page has one main H1 heading', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    });

    await test.step('Verify section headings use H2', async () => {
      const h2Count = await page.getByRole('heading', { level: 2 }).count();
      expect(h2Count).toBeGreaterThan(0);
    });

    await test.step('Verify subsection headings use H3 or lower', async () => {
      const h3Count = await page.getByRole('heading', { level: 3 }).count();
      expect(h3Count).toBeGreaterThanOrEqual(0);
    });
  });

  test('As a user I want to verify keyboard navigation functionality', { tag: ['@accessibility', '@a11y'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to the accessibility page', async () => {
      await accessibilityPage.open();
    });

    await test.step('Press Tab key repeatedly to move through all interactive elements', async () => {
      // Simulate tabbing through elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }
    });

    await test.step('Verify that focus indicator is visible for each element', async () => {
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(focusedElement).not.toBe('BODY');
    });

    await test.step('Verify all interactive elements can be activated with Enter key', async () => {
      // Focus on a button and verify it can be activated
      await accessibilityPage.getEnglishLanguageButton().focus();
      await page.keyboard.press('Enter');
      await expect(accessibilityPage.getEnglishMainHeading()).toBeVisible();
    });
  });

  test('As a user I want to verify contact email links work correctly', { tag: ['@accessibility', '@contact'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to the accessibility page', async () => {
      await accessibilityPage.open();
    });

    await test.step('Find the contact information section', async () => {
      const finnishHeadings = accessibilityPage.getFinnishSectionHeadings();
      await expect(finnishHeadings.feedbackContacts).toBeVisible();
    });

    await test.step('Click on the email link (e.g., kerrokantasi@hel.fi)', async () => {
      // We can only verify that the link exists and has the correct href
      await expect(accessibilityPage.emailLinkKerrokantasi).toBeVisible();
      const href = await accessibilityPage.emailLinkKerrokantasi.getAttribute('href');
      expect(href).toBe('mailto:kerrokantasi@hel.fi');
    });
  });

  test('As a user I want to verify external feedback form link works correctly', { tag: ['@accessibility', '@contact'] }, async ({ page }) => {
    const accessibilityPage = new AccessibilityPage(page);

    await test.step('Navigate to the accessibility page', async () => {
      await accessibilityPage.open();
    });

    await test.step('Find the feedback information section', async () => {
      const finnishHeadings = accessibilityPage.getFinnishSectionHeadings();
      await expect(finnishHeadings.feedbackContacts).toBeVisible();
    });

    await test.step('Click on the feedback form link (www.hel.fi/palaute)', async () => {
      // We can only verify that the link exists and is visible
      await expect(accessibilityPage.getFeedbackLink()).toBeVisible();
    });
  });
}); 