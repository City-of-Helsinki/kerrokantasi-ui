class UserHearingsPage {

  constructor(page) {
    this.page = page;
  }

  // Navigation and Authentication
  get loginButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' }); }
  get logoutButton() { return this.page.getByRole('button', { name: 'Kirjaudu ulos' }); }
  get userHearingsNavLink() { return this.page.getByRole('navigation').getByRole('link', { name: 'Omat kuulemiset' }); }
  get userProfileNavLink() { return this.page.getByRole('navigation').getByRole('link', { name: 'Omat tiedot' }); }

  // Page Header and Actions
  get pageTitle() { return this.page.getByRole('heading', { name: 'Omat kuulemiset', level: 1 }); }
  get createHearingLink() { return this.page.getByRole('link', { name: 'Luo uusi kuuleminen' }); }
  get createHearingButton() { return this.page.getByRole('button', { name: 'Luo uusi kuuleminen' }); }
  get toolsButton() { return this.page.getByRole('button', { name: 'Työkalupalkki' }); }

  // Filtering and Sorting
  get sortDropdown() { return this.page.getByRole('main').getByRole('button', { name: /Järjestä/ }); }
  get sortOptionNewestFirst() { return this.page.getByRole('option', { name: 'Uusimmat ensin' }); }
  get sortOptionOldestFirst() { return this.page.getByRole('option', { name: 'Vanhimmat ensin' }); }
  get sortOptionLastClosing() { return this.page.getByRole('option', { name: 'Viimeisenä sulkeutuvat' }); }
  get sortOptionFirstClosing() { return this.page.getByRole('option', { name: 'Ensimmäisenä sulkeutuvat' }); }
  get sortOptionMostCommented() { return this.page.getByRole('option', { name: 'Eniten kommentoidut' }); }
  get sortOptionLeastCommented() { return this.page.getByRole('option', { name: 'Vähiten kommentoidut' }); }
  get showText() { return this.page.getByRole('main').getByText('Näytä'); }
  get organizationHearingsRadio() { return this.page.getByRole('radio', { name: 'Näytä Organisaation kuulemiset' }); }
  get ownHearingsRadio() { return this.page.getByRole('radio', { name: 'Näytä Omat kuulemiset' }); }

  // Hearing Section Headers
  get draftSectionHeader() { return this.page.getByRole('main').getByRole('heading', { name: /Luonnokset/, level: 2 }); }
  get queuedSectionHeader() { return this.page.getByRole('main').getByRole('heading', { name: /Julkaisua odottavat/, level: 2 }); }
  get openSectionHeader() { return this.page.getByRole('main').getByRole('heading', { name: /Avoimet/, level: 2 }); }
  get closedSectionHeader() { return this.page.getByRole('main').getByRole('heading', { name: /Sulkeutuneet/, level: 2 }); }

  // Hearing Cards
  get hearingTitles() { return this.page.getByRole('main').getByRole('heading', { level: 3 }).getByRole('link'); }

  getHearingTitleByName(name) {
    return this.page.getByRole('main').getByRole('heading', { name, level: 3 });
  }

  getHearingLinkByName(name) {
    return this.page.getByRole('main').getByRole('link', { name });
  }

  get closingStatusTexts() { return this.page.getByRole('main').getByText(/Sulkeutuu/); }
  get closedStatusTexts() { return this.page.getByRole('main').getByText(/Sulkeutui/); }
  get commentCountTexts() { return this.page.getByRole('main').getByText(/Kommentti/); }

  // Action methods
  async navigate() {
    await this.page.goto('/user-hearings');
  }

  async clickCreateHearing() {
    await this.createHearingButton.click();
  }

  async openToolsDropdown() {
    await this.toolsButton.click();
  }

  async selectSortOption(optionName) {
    await this.sortDropdown.click();
    const option = this.page.getByRole('option', { name: optionName });
    await option.click();
  }

  async toggleToOrganizationHearings() {
    await this.openToolsDropdown();
    await this.organizationHearingsRadio.click();
  }

  async toggleToOwnHearings() {
    await this.openToolsDropdown();
    await this.ownHearingsRadio.click();
  }

  async clickOnHearing(hearingName) {
    await this.getHearingLinkByName(hearingName).click();
  }

  async clickShowAllInSection(sectionHeaderText) {
    const sectionHeader = this.page.getByRole('heading', { name: sectionHeaderText, level: 2 });
    const section = sectionHeader.locator('..').locator('..');
    const showAllButton = section.getByRole('button', { name: /Näytä kaikki/ });
    await showAllButton.click();
  }
}

module.exports = { UserHearingsPage }; 