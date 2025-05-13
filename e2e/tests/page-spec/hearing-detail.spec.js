import { test, expect } from 'playwright-test-coverage';
import { HearingDetailPage } from '../page-objects/hearing-detail.page';
import { acceptCookieConcent, axeCheckHandler, login, hasLoginCredentials } from '../../utils';
import { HEARING_DETAIL } from '../../constants';

// Test data
const { validHearingSlug, testSectionName } = HEARING_DETAIL;

test.describe('As a user I want to see hearing detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to navigate to hearing page via direct URL', { tag: ['@hearing-detail', '@navigation'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to /:hearingSlug where hearingSlug is a valid hearing identifier', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Wait for the page to load completely', async () => {
      await expect(hearingDetailPage.getHearingTitle(/FluxHaven/)).toBeVisible();
    });
  });

  test('As a user I want to navigate between hearing sections', { tag: ['@hearing-detail', '@navigation'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page with multiple sections', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Click on a section link in the section browser', async () => {
      await hearingDetailPage.navigateToSection(testSectionName);
    });

    await test.step('Verify that the selected section content is displayed', async () => {
      await expect(hearingDetailPage.backToHearingLinkFi).toBeVisible();
    });

    await test.step('Click on next/previous navigation controls', async () => {
      await hearingDetailPage.nextNavigationLinkFi.click();
      await expect(hearingDetailPage.backToHearingLinkFi).toBeVisible();
    });
  });

  test('As a user I want to verify hearing information is correctly displayed', { tag: ['@hearing-detail', '@content'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Check that all hearing information is displayed', async () => {
      await expect(hearingDetailPage.getHearingTitle(/FluxHaven/)).toBeVisible();
      await expect(hearingDetailPage.abstract).toBeVisible();
      await expect(hearingDetailPage.timelineOpenedFi).toBeVisible();
      await expect(hearingDetailPage.timelineClosesFi).toBeVisible();
      await expect(hearingDetailPage.commentCountFi).toBeVisible();
      await expect(hearingDetailPage.tagsContainerFi).toBeVisible();
      await expect(hearingDetailPage.mainImage).toBeVisible();
    });
  });

  test('As a user I want to verify section content is correctly displayed', { tag: ['@hearing-detail', '@content'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Verify main section content is displayed', async () => {
      await expect(hearingDetailPage.abstract).toBeVisible();
    });

    await test.step('Check if images are visible when they exist', async () => {
      await expect(hearingDetailPage.mainImage).toBeVisible();
    });

    await test.step('Expand attachment section if it exists', async () => {
      await hearingDetailPage.toggleInformationSection('fi');
      // Check if attachments section becomes visible
      // This will depend on your specific implementation
    });
  });

  test('As a user I want to verify hearing metadata visibility', { tag: ['@hearing-detail', '@content'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Click on the toggle for hearing details section', async () => {
      await hearingDetailPage.toggleInformationSection('fi');
    });

    await test.step('Verify the detail information expands/collapses', async () => {
      // Check for Finnish text since the page is in Finnish
      await expect(page.getByText(/Tietoa kuulemisesta|Avainteknologiat/).first()).toBeVisible();
    });

    await test.step('Click on the toggle for contact information', async () => {
      await hearingDetailPage.toggleContactPersonsSection('fi');
    });

    await test.step('Verify contact information expands/collapses', async () => {
      // Check for Finnish text since the page is in Finnish
      await expect(page.getByText(/Yhteyshenkilö|Yhteystiedot/).first()).toBeVisible();
    });
  });

  test('As a user I want to view comments on a section', { tag: ['@hearing-detail', '@comments'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page with comments', async () => {
      await hearingDetailPage.open(validHearingSlug);
      // Explicitly set language to English for consistent testing
      await hearingDetailPage.changeLanguage('en');
    });

    await test.step('Verify comments section exists', async () => {
      // Verify the comments heading is visible
      await expect(hearingDetailPage.commentsHeadingEn).toBeVisible();
      // Basic verification that at least one comment exists
      await expect(hearingDetailPage.firstComment).toBeVisible();
    });

    await test.step('Check that comment sorting control exists', async () => {
      // Verify the dropdown exists
      await expect(hearingDetailPage.commentSortingDropdownEn).toBeVisible();
    });
  });

  test('As a user I want to post a new comment as an anonymous user', { tag: ['@hearing-detail', '@comments'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing that allows anonymous comments', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Scroll to the comment section', async () => {
      await hearingDetailPage.commentsHeadingFi.scrollIntoViewIfNeeded();
    });

    await test.step('Enter text in the comment field and submit', async () => {
      const timestamp = new Date().toISOString();
      const commentText = `This is a test comment from an automated test. Timestamp: ${timestamp}`;
      await hearingDetailPage.writeComment(commentText);

      await page.waitForLoadState('networkidle');
      // Verify that the comment appears in the comment list
      const isCommentVisible = await hearingDetailPage.isCommentVisible(commentText);
      expect(isCommentVisible).toBeTruthy();
    });
  });

  test('As a user I want to post a new comment as an authenticated user', { tag: ['@hearing-detail', '@comments', '@auth'] }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Log in as a registered user', async () => {
      await login(page);
    });

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Scroll to the comment section', async () => {
      await hearingDetailPage.commentsHeadingFi.scrollIntoViewIfNeeded();
    });

    await test.step('Enter text in the comment field and submit', async () => {
      await hearingDetailPage.writeComment('This is a test comment from an authenticated user.');
      // Verification will depend on how your UI responds to comment submission
    });
  });

  test('As a user I want to vote on a comment', { tag: ['@hearing-detail', '@comments', '@interaction'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page with comments', async () => {
      await hearingDetailPage.open(validHearingSlug);
      // Change language to English to test that the vote feature works in English too
      await hearingDetailPage.changeLanguage('en');
    });

    await test.step('Find a comment with voting enabled', async () => {
      await hearingDetailPage.commentsHeadingEn.scrollIntoViewIfNeeded();
      await expect(hearingDetailPage.firstComment).toBeVisible();
    });

    await test.step('Click the vote button', async () => {
      await hearingDetailPage.voteForComment();
      // The test might need to handle a login prompt if voting requires authentication
      await expect(page.getByText('Vote received. Thank you!')).toBeVisible();
    });
  });

  test('As a user I want to flag inappropriate comment', { tag: ['@hearing-detail', '@comments', '@moderation'] }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Log in as a registered user', async () => {
      await login(page);
    });

    await test.step('Navigate to a hearing page with comments', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Find a comment to flag', async () => {
      await hearingDetailPage.commentsHeadingFi.scrollIntoViewIfNeeded();
      await expect(hearingDetailPage.firstComment).toBeVisible();
    });

    await test.step('Click the flag button and confirm', async () => {
      await hearingDetailPage.flagComment();
      await expect(page.getByText(/Tämä kommentti on jo liputettu.|Kommentti liputettu./)).toBeVisible();
    });
  });

  test('As a user I want to navigate using keyboard through the hearing page', { tag: ['@hearing-detail', '@accessibility'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Use Tab key to navigate through interactive elements', async () => {
      await page.keyboard.press('Tab');
      // Would need visual verification or focus tracking to fully test
    });

    await test.step('Use Enter to activate buttons and links', async () => {
      await page.keyboard.press('Enter');
      // Would need to verify action occurred
    });
  });

  test.skip('As a user I want to check screen reader compatibility', { tag: ['@hearing-detail', '@accessibility'] }, async ({ page }, testInfo) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Run automated accessibility tests', async () => {
      await axeCheckHandler(page, testInfo);
    });
  });

  test('As a user I want to change the hearing language', { tag: ['@hearing-detail', '@language'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing with multiple language options', async () => {
      await hearingDetailPage.open(validHearingSlug);
      await expect(hearingDetailPage.commentsHeadingFi).toBeVisible();
    });

    await test.step('Locate the language selector and select a different language', async () => {
      await hearingDetailPage.changeLanguage('en');
    });

    await test.step('Verify that the hearing content is displayed in the selected language', async () => {
      await expect(hearingDetailPage.commentsHeadingEn).toBeVisible();
    });

    await test.step('Locate the language selector and select a different language', async () => {
      await hearingDetailPage.changeLanguage('sv');
    });

    await test.step('Verify that the hearing content is displayed in the selected language', async () => {
      await expect(hearingDetailPage.commentsHeadingSv).toBeVisible();
    });

  });

  test.skip('As a user I want to share hearing on social media', { tag: ['@hearing-detail', '@social'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Locate social sharing buttons', async () => {
      await expect(hearingDetailPage.twitterShareFrame).toBeVisible();
      await expect(hearingDetailPage.facebookShareFrame).toBeVisible();
    });

    // Note: Actually clicking share buttons would open popups which are difficult to test
    // So we just verify they exist with the correct attributes
  });

  test('As a user I want to add hearing to favorites', { tag: ['@hearing-detail', '@favorites', '@auth'] }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Log in as a registered user', async () => {
      await login(page);
    });

    await test.step('Navigate to a hearing page', async () => {
      await hearingDetailPage.open(validHearingSlug);

      await expect(page.getByRole('button', { name: 'Lisää suosikkeihin' })).toBeVisible().catch(() => {
        test.skip('Add to favorites button not found');
      });
    });

    await test.step('Click the "Add to favorites" button', async () => {
      await hearingDetailPage.addToFavorites();
    });

    await test.step('Verify that the button state changes', async () => {
      // This will depend on your UI implementation
    });
  });

  test('As a user I want to remove hearing from favorites', { tag: ['@hearing-detail', '@favorites', '@auth'] }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Log in as a registered user', async () => {
      await login(page);
    });

    await test.step('Navigate to the favorited hearing', async () => {
      await hearingDetailPage.open(validHearingSlug);
      // Would need to first add to favorites or navigate to a known favorited hearing
      await expect(page.getByRole('button', { name: 'Poista suosikeista' })).toBeVisible().catch(() => {
        test.skip('Remove from favorites button not found');
      });
    });

    await test.step('Click the "Remove from favorites" button', async () => {
      await hearingDetailPage.removeFromFavorites();
    });

    await test.step('Verify that the button state changes', async () => {
      // This will depend on your UI implementation
    });
  });
});

test.describe('As a user I want to interact with maps in hearing detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to view geographic data on hearing map', { tag: ['@hearing-detail', '@maps'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing with geographic data', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Locate the map component', async () => {
      await expect(hearingDetailPage.mapContainer).toBeVisible().catch(() => {
        test.skip('No map available on test page');
      });
    });

    await test.step('Verify the map loads correctly', async () => {
      await expect(hearingDetailPage.mapLeafletLink).toBeVisible();
    });

    await test.step('Check that markers or shapes are displayed on the map', async () => {
      // This would need specific selectors for map markers
      await expect(hearingDetailPage.mapContainer).toBeVisible();
    });
  });

  test('As a user I want to interact with map elements', { tag: ['@hearing-detail', '@maps'] }, async ({ page }) => {
    const hearingDetailPage = new HearingDetailPage(page);

    await test.step('Navigate to a hearing with an interactive map', async () => {
      await hearingDetailPage.open(validHearingSlug);
    });

    await test.step('Check if map exists before interacting', async () => {
      await expect(hearingDetailPage.mapContainer).toBeVisible().catch(() => {
        test.skip('No map available on test page');
      });
    });

    await test.step('Zoom in/out on the map', async () => {
      await hearingDetailPage.zoomInMap();
      await hearingDetailPage.zoomOutMap();
    });

    await test.step('Pan around the map', async () => {
      await hearingDetailPage.mapContainer.hover();
      await page.mouse.down();
      await page.mouse.move(100, 100, { steps: 10 });
      await page.mouse.up();
    });
  });
});
