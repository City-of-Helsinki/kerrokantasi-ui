import { test, expect } from 'playwright-test-coverage';
import { HearingsListingPage } from '../page-objects/hearings-listing.page';
import { acceptCookieConcent, axeCheckHandler, login, hasLoginCredentials } from '../../utils';
import { HEARINGS_LISTING } from '../../constants';

const { hearingTitle, searchTerm, labelText } = HEARINGS_LISTING;

test.describe('As a user I want to browse hearings', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to verify list view displays hearings correctly', { tag: ['@hearings-listing', '@smoke'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);

    await test.step('Navigate to /hearings/list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Observe the hearings list', async () => {
      await expect(hearingsListingPage.pageHeading).toBeVisible();
      await expect(hearingsListingPage.hearingsCountHeading).toBeVisible();
    });

    await test.step('Verify each hearing item shows title, comment count, open/close dates, and labels', async () => {
      await expect(hearingsListingPage.firstHearingTitle).toBeVisible();
      await expect(hearingsListingPage.firstHearingCommentCount).toBeVisible();
      await expect(hearingsListingPage.firstHearingOpenDate).toBeVisible();
      await expect(hearingsListingPage.firstHearingCloseDate).toBeVisible();
      await expect(hearingsListingPage.firstHearingLabels.first()).toBeVisible();
    });

    await test.step('Verify closed hearings have a "Closed" tag', async () => {
      // Note: This may fail if there are no closed hearings in the test data
      await expect(hearingsListingPage.closedHearingTags).toBeVisible();
    });

    await test.step('Click on a hearing title', async () => {
      await hearingsListingPage.clickFirstHearing();
      // Verify navigation to hearing detail page
      await expect(page).not.toHaveURL('/hearings/list');
    });
  });

  test('As a user I want to test infinite scroll functionality', { tag: ['@hearings-listing', '@smoke'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);
    const initialCount = 10;
    await test.step('Navigate to /hearings/list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Get initial number of hearings', async () => {
      await expect(hearingsListingPage.hearingItems).toHaveCount(initialCount);
    });

    await test.step('Scroll to the bottom of the page', async () => {
      await hearingsListingPage.scrollToBottom();
      // Wait for potential loading
      await page.waitForTimeout(1000);
    });

    await test.step('Verify more hearings are loaded after scrolling', async () => {
      const newCount = await hearingsListingPage.hearingItems.count();
      // This assumes there are enough hearings in the database to trigger infinite scroll
      // If test fails, check if there's enough test data
      expect(newCount).toBeGreaterThan(initialCount);
    });
  });

  test('As a user I want to verify map view displays hearings correctly', { tag: ['@hearings-listing', '@map-view'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);

    await test.step('Navigate to /hearings/map', async () => {
      await hearingsListingPage.openMapView();
    });

    await test.step('Verify the map loads with markers for hearings', async () => {
      await expect(hearingsListingPage.mapContainer).toBeVisible();
      await expect(hearingsListingPage.mapMarkers.first()).toBeVisible();
    });

    await test.step('Click on a map marker', async () => {
      await expect(page.getByRole('button', { name: hearingTitle })).toHaveCount(2);
      await page.getByRole('button', { name: hearingTitle }).first().click();
    });

    await test.step('Verify popup shows hearing information', async () => {
      await expect(hearingsListingPage.mapPopup).toBeVisible();
    });
  });

  test('As a user I want to test "Show only open" checkbox in map view', { tag: ['@hearings-listing', '@map-view'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);
    let initialCount;

    await test.step('Navigate to /hearings/map', async () => {
      await hearingsListingPage.openMapView();
    });

    await test.step('Observe initial map markers', async () => {
      // Wait for map to be fully loaded
      await page.waitForSelector('.leaflet-container');
      initialCount = await hearingsListingPage.mapMarkers.count();
      expect(initialCount).toBeGreaterThan(0);
    });

    await test.step('Click "Show only open" checkbox', async () => {
      await hearingsListingPage.toggleShowOnlyOpenInMap();
    });

    await test.step('Verify map markers are updated to show only open hearings', async () => {
      // Wait for the map to update with a longer timeout
      const newCount = await hearingsListingPage.mapMarkers.count();
      // Check that markers are still visible (might be fewer)
      expect(initialCount).toBeGreaterThan(newCount);
    });
  });

  test('As a user I want to test title search functionality', { tag: ['@hearings-listing', '@search'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);

    await test.step('Navigate to /hearings/list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Enter a search term in the search input', async () => {
      await hearingsListingPage.search(searchTerm);
    });

    await test.step('Verify URL updates with search parameter', async () => {
      await expect(page).toHaveURL(new RegExp(`search=${searchTerm}`));
    });

    await test.step('Verify hearings list updates to show only matching results', async () => {
      // This assumes search results are returned
      // If test fails, check if the search term exists in test data
      await expect(hearingsListingPage.hearingItems.first()).toBeVisible();
    });
  });

  test('As a user I want to test label filtering', { tag: ['@hearings-listing', '@filter'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);

    await test.step('Navigate to /hearings/list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Select one or more labels from the label dropdown', async () => {
      await hearingsListingPage.selectLabel(labelText);
    });

    await test.step('Verify that label is selected', async () => {
      await expect(page.getByRole('button', { name: `Poista ${labelText}`, exact: true })).toBeVisible();
    });

    await test.step('Verify hearings list updates to show only hearings with selected labels', async () => {
      // This assumes there are hearings with the selected label
      // If test fails, check if the label exists in test data
      await expect(page.getByRole('link', { name: `${labelText}`, exact: true })).not.toHaveCount(0);
    });
  });


  test.skip('As a user I want to test combined filters (search, labels, open status)', { tag: ['@hearings-listing', '@filter'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);

    await test.step('Navigate to /hearings/list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Enter a search term', async () => {
      await hearingsListingPage.searchInput.fill(searchTerm);
    });

    await test.step('Select one or more labels', async () => {
      await hearingsListingPage.selectLabel(labelText);
    });


    await test.step('Click search button', async () => {
      await hearingsListingPage.searchButton.click();
    });

    await test.step('Verify hearings list updates correctly with all filters applied', async () => {
      // Verify URL contains all filter parameters
      await expect(page).toHaveURL(new RegExp(`search=${searchTerm}`));
      await expect(page).toHaveURL(new RegExp(`label=${labelText}`));

      // Verify hearings are visible (assumes there are matching hearings)
      // This test may fail if there are no hearings matching all criteria
      await expect(hearingsListingPage.hearingItems.first()).toBeVisible();
    });
  });
});

test.describe('As an admin I want to manage hearings', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookieConcent(page);
  });

  test('As a user I want to verify admin filter selector visibility', { tag: ['@hearings-listing', '@admin'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    await test.step('Navigate to /hearings/list as a regular user', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Verify admin filter selector is not visible', async () => {
      await expect(hearingsListingPage.adminFilterPublic).not.toBeVisible();
      await expect(hearingsListingPage.adminFilterPublishingQueue).not.toBeVisible();
      await expect(hearingsListingPage.adminFilterDrafts).not.toBeVisible();
      await expect(hearingsListingPage.adminFilterOwnHearings).not.toBeVisible();
    });

    await test.step('Log in as an admin user', async () => {
      await login(page);
    });

    await test.step('Navigate to hearings list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Verify admin filter selector is visible', async () => {
      await expect(hearingsListingPage.adminFilterPublic).toBeVisible();
      await expect(hearingsListingPage.adminFilterPublishingQueue).toBeVisible();
      await expect(hearingsListingPage.adminFilterDrafts).toBeVisible();
      await expect(hearingsListingPage.adminFilterOwnHearings).toBeVisible();
    });
  });

  test('As an admin I want to test admin filter functionality', { tag: ['@hearings-listing', '@admin'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    await test.step('Log in as an admin user', async () => {
      await login(page);
    });

    await test.step('Navigate to hearings list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Select different admin filter options', async () => {
      await hearingsListingPage.adminFilterOwnHearings.click();
    });

    await test.step('Verify hearings list updates according to selected filter', async () => {
      // This assumes there are published hearings
      // If test fails, check if there are published hearings in test data
      await expect(hearingsListingPage.hearingItems.first()).toBeVisible();
    });
  });

  test('As an admin I want to verify "Create Hearing" button functionality', { tag: ['@hearings-listing', '@admin'] }, async ({ page }) => {
    const hearingsListingPage = new HearingsListingPage(page);
    test.skip(!hasLoginCredentials, 'No test user credentials provided');

    await test.step('Log in as an admin user', async () => {
      await login(page);
    });

    await test.step('Navigate to hearings list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Verify "Create Hearing" button is visible', async () => {
      await expect(hearingsListingPage.createHearingButton).toBeVisible();
    });

    await test.step('Click "Create Hearing" button', async () => {
      await hearingsListingPage.clickCreateHearing();
    });

    await test.step('Verify navigation to new hearing creation page', async () => {
      // Check that URL has changed from the hearings list
      await expect(page).not.toHaveURL('/hearings/list');
    });
  });

  test('As a user I want to run accessibility checks on hearings listing page', { tag: ['@hearings-listing', '@accessibility'] }, async ({ page }, testInfo) => {
    const hearingsListingPage = new HearingsListingPage(page);

    await test.step('Navigate to hearings list', async () => {
      await hearingsListingPage.open();
    });

    await test.step('Run automated accessibility tests', async () => {
      await axeCheckHandler(page, testInfo);
    });
  });
}); 