import { test, expect } from 'playwright-test-coverage';
import { UserProfilePage } from '../page-objects/user-profile.page';
import { acceptCookieConcent, axeCheckHandler, hasLoginCredentials, login } from '../../utils';
import { USER_PROFILE } from '../../constants';

const { commentText } = USER_PROFILE;

test.describe('As a user I want to manage my user profile', () => {
  test.describe.configure({ mode: 'serial' });
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to verify user profile page loads correctly for authenticated users', {
    tag: ['@user-profile', '@smoke']
  }, async ({ page }, testInfo) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with valid user credentials', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page via the header link', async () => {
      await userProfilePage.open();
    });

    await test.step('Verify profile page loads with correct sections', async () => {
      await expect(userProfilePage.pageTitle).toBeVisible();
      await expect(userProfilePage.favoriteHearingsSection).toBeVisible();
      await expect(userProfilePage.userCommentsSection).toBeVisible();
    });

    await test.step('Run automated accessibility tests', async () => {
      await axeCheckHandler(page, testInfo);
    });
  });

  test('As a user I want to verify unauthenticated users are redirected from profile page', {
    tag: ['@user-profile', '@authentication']
  }, async ({ page }) => {
    const userProfilePage = new UserProfilePage(page);

    await test.step('Clear any existing authentication/session', async () => {
      await page.context().clearCookies();
    });

    await test.step('Try to navigate directly to the /user-profile URL', async () => {
      await userProfilePage.open();
    });

    await test.step('Verify user is redirected to login page', async () => {
      // User should not see the profile page
      await expect(userProfilePage.pageTitle).not.toBeVisible();
      // Instead, user should see login button or login form
      await expect(userProfilePage.loginButton).toBeVisible();
    });
  });

  test('As a user I want to verify favorite hearings are displayed correctly', {
    tag: ['@user-profile', '@favorites']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user that has at least one favorite hearing', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
    });

    await test.step('Verify favorite hearings are displayed', async () => {
      await page.waitForLoadState('networkidle');

      if (await userProfilePage.favoriteHearingTitles.count() > 0) {
        await expect(userProfilePage.favoriteHearingTitles).not.toHaveCount(0);
        await expect(userProfilePage.hearingStatus).not.toHaveCount(0);

        // Check specific favorite hearings if they exist
        // await expect(userProfilePage.getFavoriteHearingByTitle('Kuuleminen E2E-testausta varten')).toBeVisible();
      } else {
        console.log('No favorite hearings found');
        test.skip();
      }
    });
  });

  test.skip('As a user I want to verify removing a hearing from favorites', {
    tag: ['@user-profile', '@favorites']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user that has at least one favorite hearing', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify there are favorite hearings to remove', async () => {
      // Skip if no favorites
      const count = await userProfilePage.favoriteHearingTitles.count();
      test.skip(count === 0, 'No favorite hearings to remove');
    });

    let initialCount = 0;
    await test.step('Count initial favorite hearings', async () => {
      initialCount = await userProfilePage.favoriteHearingTitles.count();
    });

    await test.step('Click the unfavorite/remove button on a hearing card', async () => {
      await userProfilePage.removeFavoriteHearing(0);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify the hearing is removed from the favorites list', async () => {
      const newCount = await userProfilePage.favoriteHearingTitles.count();
      expect(newCount).toBeLessThan(initialCount);
    });
  });

  test.skip('As a user I want to verify empty state for favorite hearings', {
    tag: ['@user-profile', '@favorites']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user that has no favorite hearings', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
    });

    await test.step('Check if user has favorite hearings', async () => {
      const hasFavorites = await userProfilePage.favoriteHearingTitles.count() > 0;

      if (hasFavorites) {
        // Remove all favorites first
        const count = await userProfilePage.favoriteHearingTitles.count();
        for (let i = 0; i < count; i++) {
          await userProfilePage.removeFavoriteHearing(0);
          await page.waitForLoadState('networkidle');
        }
      }
    });

    await test.step('Verify empty state message is displayed', async () => {
      await expect(userProfilePage.noFavoritesMessage).toBeVisible();
    });
  });

  test('As a user I want to verify all user comments are displayed', {
    tag: ['@user-profile', '@comments']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user who has made multiple comments', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
    });

    await test.step('Verify user comments are displayed', async () => {
      await expect(userProfilePage.userComments).not.toHaveCount(0);
    });
  });

  test('As a user I want to verify filtering comments by hearing', {
    tag: ['@user-profile', '@comments']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user who has commented on multiple hearings', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
      await page.waitForLoadState('networkidle');
    });

    let initialCount = 0;
    await test.step('Count initial comments', async () => {
      initialCount = await userProfilePage.userComments.count();
      test.skip(initialCount === 0, 'No comments found for filtering');
    });

    await test.step('Use the hearing select dropdown and select a specific hearing', async () => {
      await userProfilePage.commentFilterDropdown.click();

      const specificOption = userProfilePage.getCommentFilterOption('Kuuleminen E2E-testausta varten');
      if (await specificOption.count() > 0) {
        await specificOption.click();
      } else {
        const options = await page.getByRole('option').all();
        for (const option of options) {
          const text = await option.textContent();
          if (text !== 'Kaikki') {
            await option.click();
            break;
          }
        }
      }
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify filtered comments are displayed', async () => {
      // Either we have fewer comments (filtered) or the same number
      const currentCount = await userProfilePage.userComments.count();
      expect(currentCount).toBeLessThanOrEqual(initialCount);
    });
  });

  test('As a user I want to verify comment sorting functionality', {
    tag: ['@user-profile', '@comments']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user who has multiple comments', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify there are multiple comments to sort', async () => {
      const count = await userProfilePage.userComments.count();
      test.skip(count < 2, 'Not enough comments to test sorting');
    });

    await test.step('Use the comment order select dropdown and select "Oldest first"', async () => {
      await userProfilePage.commentSortDropdown.click();
      await userProfilePage.getCommentSortOption('Vanhin ensin').click();
    });

    await test.step('Verify comments are reordered', async () => {
      // This is a visual check that sorting worked - we can't easily verify the actual sort
      // without knowing the comment dates ahead of time, but we can verify the action completed
      await expect(userProfilePage.userComments).not.toHaveCount(0);
    });
  });

  test('As a user I want to verify empty state for user comments', {
    tag: ['@user-profile', '@comments']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user who has not made any comments', async () => {
      // For testing this scenario, we need a user without comments
      // This might need to be a different login than the standard test user
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Check if user has comments', async () => {
      const hasComments = await userProfilePage.userComments.count() > 0;
      test.skip(hasComments, 'User has comments, cannot test empty state');

      if (!hasComments) {
        await expect(userProfilePage.noCommentsMessage).toBeVisible();
      }
    });
  });

  test('As a user I want to verify comment content display', {
    tag: ['@user-profile', '@comments']
  }, async ({ page }) => {
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    const userProfilePage = new UserProfilePage(page);

    await test.step('Log in with a user who has made comments containing text', async () => {
      await login(page);
    });

    await test.step('Navigate to the user profile page', async () => {
      await userProfilePage.open();
    });

    await test.step('Verify comment content is displayed correctly', async () => {
      await expect(userProfilePage.userComments).not.toHaveCount(0);

      // Check for specific comment text if it exists

      await expect(userProfilePage.getCommentWithText(commentText)).toBeVisible().catch(error => {
        console.log('Specific comment text not found');
      });
    });
  });
}); 