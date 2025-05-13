/**
 * Page Object Model for Hearings Listing page
 */
class HearingsListingPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation
  get listTab() {
    return this.page.getByRole('tab', { name: 'Lista' });
  }

  get mapTab() {
    return this.page.getByRole('tab', { name: 'Kartta' });
  }

  // Page elements - List view
  get pageHeading() {
    return this.page.getByRole('heading', { name: 'Kaikki kuulemiset', level: 1 });
  }

  get hearingsCountHeading() {
    return this.page.getByRole('heading', { level: 2 }).filter({ hasText: /\d+ kuulemista/ });
  }

  get hearingsList() {
    return this.page.getByRole('main').getByRole('list');
  }

  get hearingItems() {
    return this.hearingsList.locator('li');
  }

  get firstHearingTitle() {
    return this.hearingsList.getByRole('heading', { level: 2 }).first();
  }

  get firstHearingTitleLink() {
    return this.firstHearingTitle.getByRole('link');
  }

  get firstHearingCommentCount() {
    return this.hearingItems.first().getByText(/Kommentt/);
  }

  get firstHearingOpenDate() {
    return this.hearingItems.first().getByText(/Avautui/);
  }

  get firstHearingCloseDate() {
    return this.hearingItems.first().getByText(/Sulkeutu/, { exact: false }).filter({ hasText: /klo/ });
  }

  get firstHearingLabels() {
    return this.hearingItems.first().getByRole('link').filter({ hasText: /testi|tekoäly|kokeilu|luonto/ });
  }

  get closedHearingTags() {
    return this.hearingsList.locator('.hearing-list-item-closed > #hds-tag > #hds-tag-label > span').first();
  }

  // Search and filters
  get searchInput() {
    return this.page.getByRole('combobox', { name: 'Etsi otsikoista' });
  }

  get searchButton() {
    return this.page.getByRole('button', { name: 'Etsi', exact: true });
  }

  get labelDropdown() {
    return this.page.getByRole('combobox', { name: 'Hae aiheista' });
  }

  get showOnlyOpenToggle() {
    return this.page.getByText('Näytetään vain avoimet');
  }

  get showOnlyOpenCheckbox() {
    return this.page.getByRole('checkbox');
  }

  // Map view elements
  get mapContainer() {
    return this.page.locator('.leaflet-container');
  }

  get mapMarkers() {
    return this.page.locator('.leaflet-marker-icon');
  }

  get mapPopup() {
    return this.page.locator('.leaflet-popup-content');
  }

  // Admin features

  get adminFilterPublic() {
    return this.page.getByRole('button', { name: 'Julkiset', exact: true });
  }

  get adminFilterPublishingQueue() {
    return this.page.getByRole('button', { name: 'Julkaisujono', exact: true });
  }

  get adminFilterDrafts() {
    return this.page.getByRole('button', { name: 'Luonnokset', exact: true });
  }

  get adminFilterOwnHearings() {
    return this.page.locator('#main-container').getByRole('link', { name: 'Omat kuulemiset', exact: true });
  }

  get createHearingButton() {
    return this.page.getByRole('button', { name: /Luo uusi kuuleminen/i });
  }

  get loginButton() {
    return this.page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' });
  }

  // Navigation actions
  async open() {
    await this.page.goto('/hearings/list');
  }

  async openMapView() {
    await this.page.goto('/hearings/map');
  }

  async switchToMapView() {
    await this.mapTab.click();
  }

  async switchToListView() {
    await this.listTab.click();
  }

  // Interaction actions
  async search(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }

  async selectLabel(labelText) {
    await this.labelDropdown.click();
    await this.labelDropdown.fill(labelText);
    await this.page.getByRole('option', { name: labelText, exact: true }).click();
  }

  async toggleShowOnlyOpen() {
    await this.showOnlyOpenToggle.click();
  }

  async toggleShowOnlyOpenInMap() {
    await this.showOnlyOpenCheckbox.click();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async clickFirstHearing() {
    await this.firstHearingTitleLink.click();
  }

  // Admin actions
  async login() {
    await this.loginButton.click();
  }

  async clickCreateHearing() {
    await this.createHearingButton.click();
  }
}

module.exports = { HearingsListingPage }; 