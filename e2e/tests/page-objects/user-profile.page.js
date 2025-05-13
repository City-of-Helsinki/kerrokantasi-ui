class UserProfilePage {
  constructor(page) {
    this.page = page;
  }

  // Navigation and Authentication
  get loginButton() {
    return this.page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' });
  }

  get emailField() {
    return this.page.getByRole('textbox', { name: 'Sähköposti' });
  }

  get passwordField() {
    return this.page.getByRole('textbox', { name: 'Salasana' });
  }

  get loginSubmitButton() {
    return this.page.getByRole('button', { name: 'Kirjaudu sisään' });
  }

  get profileNavLink() {
    return this.page.getByRole('navigation').getByRole('link', { name: 'Omat tiedot' });
  }

  // Profile Page Sections
  get pageTitle() {
    return this.page.getByRole('heading', { name: 'Omat tiedot', level: 1 });
  }

  get favoriteHearingsSection() {
    return this.page.getByRole('heading', { name: 'Suosikkikuulemiset', level: 2 });
  }

  get userCommentsSection() {
    return this.page.getByRole('heading', { name: /Lisäämäni kommentit/, level: 2 });
  }

  // Favorite Hearings
  get favoriteHearingTitles() {
    return this.page.getByRole('main').getByRole('heading', { level: 3 });
  }

  getFavoriteHearingByTitle(title) {
    return this.page.getByRole('main').getByRole('heading', { name: title, level: 3 });
  }

  get hearingStatus() {
    return this.page.getByRole('main').getByText(/Sulkeutuu/);
  }

  getHearingTag(tag) {
    return this.page.getByRole('main').getByRole('link', { name: tag });
  }

  get removeFromFavoritesButton() {
    return this.page.getByRole('main').getByRole('button', { name: 'Poista suosikeista' });
  }

  get noFavoritesMessage() {
    return this.page.getByRole('main').getByText(/Ei suosikkikuulemisia/);
  }

  // User Comments
  get commentFilterDropdown() {
    return this.page.getByRole('main').getByRole('button', { name: 'Valitse tietyn kuulemisen kommentit' });
  }

  getCommentFilterOption(option) {
    return this.page.getByRole('option', { name: option });
  }

  get commentSortDropdown() {
    return this.page.getByRole('main').getByRole('button', { name: /Järjestä/ });
  }

  getCommentSortOption(option) {
    return this.page.getByRole('option', { name: option });
  }

  get userComments() {
    return this.page.getByRole('main').locator('.hearing-comment');
  }

  getCommentWithText(text) {
    return this.page.getByRole('main').getByText(text);
  }

  getHearingLink(title) {
    return this.page.getByRole('main').getByRole('link', { name: title });
  }

  get noCommentsMessage() {
    return this.page.getByRole('main').getByText(/Ei kommentteja/);
  }

  // Footer Navigation
  get profileFooterLink() {
    return this.page.getByRole('contentinfo').getByRole('link', { name: 'Omat tiedot' });
  }

  get myHearingsFooterLink() {
    return this.page.getByRole('contentinfo').getByRole('link', { name: 'Omat kuulemiset' });
  }

  // Actions
  async open() {
    await this.page.goto('/user-profile');
  }

  async login(email, password) {
    await this.loginButton.click();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginSubmitButton.click();
  }

  async navigateToProfilePage() {
    await this.profileNavLink.click();
  }

  async removeFavoriteHearing(index = 0) {
    const removeButtons = await this.removeFromFavoritesButton.all();
    if (removeButtons.length > index) {
      await removeButtons[index].click();
    }
  }

  async filterCommentsByHearing(hearingTitle) {
    await this.commentFilterDropdown.click();
    await this.getCommentFilterOption(hearingTitle).click();
  }

  async sortComments(order) {
    await this.commentSortDropdown.click();
    await this.getCommentSortOption(order).click();
  }
}

module.exports = { UserProfilePage }; 