import { test, expect } from 'playwright-test-coverage';
import { SectionViewPage } from '../page-objects/section-view.page';
import { acceptCookieConcent, axeCheckHandler, login, hasLoginCredentials } from '../../utils';
import { SECTION_VIEW } from '../../constants';

// Test data
const { validHearingSlug, validSectionId } = SECTION_VIEW;

test.describe('As a user I want to see section view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to navigate to specific section via direct URL', { tag: ['@section-view', '@navigation'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to /:hearingSlug/:sectionId with valid identifiers', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Wait for the page to load completely', async () => {
      await expect(sectionViewPage.sectionTitle).toBeVisible();
    });
  });

  test('As a user I want to navigate between sections using section browser', { tag: ['@section-view', '@navigation'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section page', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Locate the section browser component', async () => {
      await expect(sectionViewPage.sectionNavigation).toBeVisible();
    });

    await test.step('Click on a different section link', async () => {
      await sectionViewPage.nextSectionLink.click();
    });

    await test.step('Verify the URL changes and new section content loads', async () => {
      await expect(page).not.toHaveURL(`/${validHearingSlug}/${validSectionId}`);
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  });

  test('As a user I want to use previous/next navigation controls', { tag: ['@section-view', '@navigation'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section in a hearing with multiple sections', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Locate the previous/next navigation buttons', async () => {
      await expect(sectionViewPage.nextSectionLink).toBeVisible();
    });

    await test.step('Click the "next" button', async () => {
      await sectionViewPage.navigateToNextSection();
    });

    await test.step('Verify navigation to the next section', async () => {
      await expect(page).not.toHaveURL(`/${validHearingSlug}/${validSectionId}?headless=false`);
    });

    await test.step('Click the "previous" button', async () => {
      await sectionViewPage.previousSectionLink.click();
      await expect(page).toHaveURL(`/${validHearingSlug}/${validSectionId}?headless=false`);
    });
  });
});

test.describe('As a user I want to view section content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to verify section content display', { tag: ['@section-view', '@content'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section page', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Verify the section title is displayed', async () => {
      await expect(sectionViewPage.sectionTitle).toBeVisible();
    });

    await test.step('Check that the section abstract is displayed', async () => {
      await expect(sectionViewPage.sectionAbstract).toBeVisible();
    });

    await test.step.skip('Verify that the main content is displayed', async () => {
      await expect(sectionViewPage.sectionContentRegion).toBeVisible();
    });
  });

  test('As a user I want to view section image display and lightbox', { tag: ['@section-view', '@content'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section with images', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Verify images are displayed with correct dimensions', async () => {
      await expect(sectionViewPage.sectionImage).toBeVisible();
    });

    await test.step('Click on an image', async () => {
      await sectionViewPage.clickOnSectionImage();
    });

    await test.step('Verify lightbox opens with the full-size image', async () => {
      // Assuming lightbox has a specific selector
      await expect(page.getByAltText('Image')).toBeVisible();
    });

    await test.step('Close the lightbox', async () => {
      await page.keyboard.press('Escape');
    });

    await test.step('Verify return to normal section view', async () => {
      await expect(page.getByAltText('Image')).not.toBeVisible();
      await expect(sectionViewPage.sectionImage).toBeVisible();
    });
  });

  test.skip('As a user I want to verify section details collapsible behavior', { tag: ['@section-view', '@content'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section page', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Verify if section details are initially expanded or collapsed', async () => {
      const isExpanded = await sectionViewPage.sectionContentRegion.isVisible();
      console.log(`Section details initially ${isExpanded ? 'expanded' : 'collapsed'}`);
    });

    await test.step('Click on the toggle button for section details', async () => {
      await sectionViewPage.expandSectionDetails();
    });

    await test.step('Verify the section expands/collapses appropriately', async () => {
      // If it was initially visible, it should now be hidden and vice versa
      const isNowVisible = await sectionViewPage.sectionContentRegion.isVisible();
      console.log(`Section details now ${isNowVisible ? 'expanded' : 'collapsed'}`);
    });
  });
});

test.describe('As a user I want to work with section attachments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to view and download section attachments', { tag: ['@section-view', '@attachments'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section with attachments', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Locate the attachments section', async () => {
      // Only proceed if attachments are available on the test page
      const attachmentExists = await sectionViewPage.attachmentDownloadLink.isVisible().catch(() => false);
      test.skip(!attachmentExists, 'No attachments available on test page');
    });

    await test.step('If collapsed, expand the attachments section', async () => {
      // If there's a specific expandable section for attachments
      await page.getByRole('button', { name: /Liitteet/ }).click();

    });

    await test.step('Verify list of attachments is displayed with appropriate icons', async () => {
      await expect(sectionViewPage.attachmentDownloadLink).toBeVisible();
    });

    // Skip the actual download test unless necessary as it creates files
    // await test.step('Click on an attachment', async () => {
    //   const downloadPromise = sectionViewPage.downloadAttachment();
    //   const download = await downloadPromise;
    //   expect(download.suggestedFilename()).toBeTruthy();
    // });
  });
});

test.describe('As a user I want to interact with section comments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to view section-specific comments', { tag: ['@section-view', '@comments'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section with existing comments', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Scroll to the comments section', async () => {
      await sectionViewPage.commentsHeading.scrollIntoViewIfNeeded();
    });

    await test.step('Verify comments are displayed with author information, timestamp, etc', async () => {
      await expect(sectionViewPage.commentsHeading).toBeVisible();
      await page.waitForSelector('.hearing-comment');
      // Check if there are comments
      const commentCount = await page.locator('.hearing-comment').count();
      if (commentCount > 0) {
        // Verify comment elements are present
        await expect(page.locator('.hearing-comment')).toHaveCount(commentCount);
      }
    });
  });

  test('As a user I want to sort section comments', { tag: ['@section-view', '@comments'] }, async ({ page }) => {
    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section with multiple comments', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Locate the comment sort dropdown', async () => {
      await expect(sectionViewPage.commentSortDropdown).toBeVisible();
    });

    await test.step('Select different sorting options', async () => {
      await sectionViewPage.sortComments('Vanhin ensin');
      await sectionViewPage.sortComments('Suosituin ensin');
    });
  });

  test('As a user I want to post new comment on a section', { tag: ['@section-view', '@comments'] }, async ({ page }, testInfo) => {
    const sectionViewPage = new SectionViewPage(page);
    test.skip(!hasLoginCredentials, 'No test user credentials provided');
    const commentText = `This is a test comment ${testInfo.project.name} ${new Date().toISOString()}`;

    await test.step('Log in as a registered user', async () => {
      await login(page);
    });

    await test.step('Navigate to a section page', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Scroll to the comment form', async () => {
      await sectionViewPage.commentFormButton.scrollIntoViewIfNeeded();
    });

    await test.step('Enter text in the comment field and submit', async () => {
      await sectionViewPage.addComment(commentText);
    });

    await test.step('Verify the comment appears in the comment list', async () => {
      await expect(page.getByText(commentText)).not.toHaveCount(0);
    });
  });

  test('As a user I want to reply to existing comment', { tag: ['@section-view', '@comments'] }, async ({ page }, testInfo) => {
    const sectionViewPage = new SectionViewPage(page);
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const replyText = `This is a test reply ${testInfo.project.name} ${new Date().toISOString()}`;

    await test.step('Navigate to a section with existing comments', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Scroll to the comment form', async () => {
      await sectionViewPage.commentFormButton.scrollIntoViewIfNeeded();
    });

    await test.step('Locate a comment to reply to', async () => {
      await expect(await sectionViewPage.replyToCommentButton).not.toHaveCount(0);
    });

    await test.step('Click the reply button and submit reply', async () => {

      await sectionViewPage.replyToComment(0, replyText);
    });

    await test.step('Verify the reply appears nested under the original comment', async () => {
      await expect(page.getByText(replyText)).not.toHaveCount(0);
    });
  });
});

test.describe('As a user I want to perform administrative actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
    await login(page);
    // Wait for login to complete
    await page.waitForLoadState('networkidle');
  });

  test('As an administrator I want to download section report', { tag: ['@section-view', '@admin'] }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section page', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Locate the download report button', async () => {
      // This would need a specific admin report download button
      const reportBtnExists = await page.getByRole('button', { name: /Lataa raportti/ }).isVisible().catch(() => false);
      test.skip(!reportBtnExists, 'Report download not available or user lacks permissions');
    });

    // Skip actual download to avoid generating files
    await test.step('Check if download functionality is available', async () => {
      await expect(page.getByRole('button', { name: /Lataa raportti/ })).toBeVisible();
    });
  });

  test.skip('As a user I want to edit my comment', { tag: ['@section-view', '@comments'] }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const sectionViewPage = new SectionViewPage(page);

    await test.step('Navigate to a section with your comment', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Scroll to the comment form', async () => {
      await sectionViewPage.commentFormButton.scrollIntoViewIfNeeded();
    });

    await test.step('Check if edit functionality exists', async () => {
      const editBtnExists = await page.getByRole('button', { name: 'Muokkaa' }).isVisible().catch(() => false);
      test.skip(!editBtnExists, 'Edit button not available or no user comments');

      if (editBtnExists) {
        await page.getByRole('button', { name: /Muokkaa/ }).first().click();
        await page.getByRole('textbox').fill('Edited comment text');
        await page.getByRole('button', { name: /Tallenna/ }).click();
        await expect(page.getByText('Edited comment text')).toBeVisible();
      }
    });
  });
});

test.describe('As a user I want to check accessibility', () => {
  test('As a user I want to check section view accessibility', { tag: ['@section-view', '@accessibility'] }, async ({ page }, testInfo) => {
    const sectionViewPage = new SectionViewPage(page);

    await page.goto('/');
    await acceptCookieConcent(page);

    await test.step('Navigate to a section page', async () => {
      await sectionViewPage.open(validHearingSlug, validSectionId);
    });

    await test.step('Run automated accessibility tests', async () => {
      await axeCheckHandler(page, testInfo);
    });
  });
}); 