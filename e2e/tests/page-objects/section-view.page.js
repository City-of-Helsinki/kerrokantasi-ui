class SectionViewPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation
  get hearingTitle() { return this.page.getByRole('heading', { name: /FluxHaven — Kausittain siirtyvä kaupunki/ }); }
  get backToHearingLink() { return this.page.getByRole('link', { name: /Takaisin kuulemisen etusivulle/ }); }
  get sectionNavigation() { return this.page.getByRole('navigation', { name: /Alaosio/ }); }
  get nextSectionLink() { return this.page.getByRole('link', { name: 'Seuraava' }); }
  get previousSectionLink() { return this.page.getByRole('link', { name: 'Edellinen' }); }
  get inactiveSectionLink() { return this.page.getByText('Epäaktiivinen linkki'); }

  // Section Information
  get sectionTitle() { return this.page.getByRole('heading', { name: /Teknologiset järjestelmät/ }); }
  get sectionSubtitle() { return this.page.getByRole('heading', { name: /Alaosio 1\/2 Teknologiset järjestelmät/ }); }
  get sectionAbstract() { return this.page.getByRole('main').getByText(/FluxHavenin innovatiiviset teknologiset järjestelmät/); }
  get sectionImage() { return this.page.getByRole('figure', { name: 'Teknologiset järjestelmät' }); }
  get commentCountIndicator() { return this.page.getByRole('main').getByText(/0 kommenttia/); }
  get writeCommentLink() { return this.page.getByRole('link', { name: 'Kirjoita kommentti' }); }

  // Section Details
  get detailsHeading() { return this.page.getByRole('heading', { level: 2 }).filter({ hasText: 'Tiedot' }); }
  get detailsButton() { return this.page.getByRole('button', { name: 'Tiedot' }); }
  get sectionContentRegion() { return this.page.getByRole('region').filter({ hasText: /FluxHaven/ }); }

  // Attachments
  get attachmentDownloadLink() { return this.page.getByRole('link', { name: 'Lataa yhteenveto kommenteista Excel-muodossa' }); }

  // Comments
  get commentsHeading() { return this.page.getByRole('heading', { name: /Mielipiteet \d+/ }); }
  get commentFormButton() { return this.page.getByRole('button', { name: /Kirjoita kommentti/ }); }
  get commentSortDropdown() { return this.page.getByRole('button', { name: /Järjestä kommentit/ }); }
  get commentTextField() { return this.page.getByRole('textbox', { name: 'Kommentti *' }); }
  get commentNicknameField() { return this.page.getByRole('textbox', { name: 'Nimimerkki' }); }
  get addImageToCommentButton() { return this.page.getByRole('button', { name: 'Lisää kuvia kommenttiisi' }); }
  get commentSubmitButton() { return this.page.getByRole('button', { name: 'Lähetä' }); }
  get commentCancelButton() { return this.page.getByRole('button', { name: 'Peru' }); }
  get existingCommentAuthor() { return this.page.getByText('Nimimerkin takaa'); }
  get commentTimestamp() { return this.page.getByText(/kuukausi sitten/); }
  get replyToCommentButton() { return this.page.getByRole('button', { name: 'Vastaa' }); }
  get likeCommentButton() { return this.page.getByRole('button', { name: /Tykkäystä. Tykkää tästä kommentista/ }); }
  get showMapMarkerButton() { return this.page.getByRole('button', { name: 'Karttamerkintä lisätty. Näytä kartta' }); }

  // Language Selection
  get finnishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Suomi' }); }
  get swedishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Svenska' }); }
  get englishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'English' }); }

  // User Actions
  get loginButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' }); }
  get voteAndCommentButton() { return this.page.getByRole('button', { name: /Äänestä ja kommentoi/ }); }

  // Action methods
  async open(hearingSlug, sectionId) {
    await this.page.goto(`/${hearingSlug}/${sectionId}`);
  }

  async navigateToNextSection() {
    await this.nextSectionLink.click();
  }

  async navigateToPreviousSection() {
    await this.previousSectionLink.click();
  }

  async navigateToHearingMainPage() {
    await this.backToHearingLink.click();
  }

  async expandSectionDetails() {
    await this.detailsButton.click();
  }

  async downloadAttachment() {
    return this.page.waitForEvent('download', async () => {
      await this.attachmentDownloadLink.click();
    });
  }

  async openCommentForm() {
    await this.commentFormButton.click();
  }

  async sortComments(option) {
    await this.commentSortDropdown.click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async addComment(text) {
    await this.openCommentForm();
    await this.commentTextField.fill(text);
    // Only click the "Hide name" checkbox if it's visible
    const hideNameCheckbox = this.page.getByRole('checkbox', { name: 'Piilota nimi' });
    if (await hideNameCheckbox.isVisible()) {
      await hideNameCheckbox.click();
    }

    await this.commentSubmitButton.click();
  }

  async replyToComment(commentIndex, replyText) {
    const replyButtons = await this.page.getByRole('button', { name: 'Vastaa' }).all();
    await replyButtons[commentIndex].click();
    await this.commentTextField.fill(replyText);
    await this.commentSubmitButton.click();
  }

  async likeComment(commentIndex) {
    const likeButtons = await this.page.getByRole('button', { name: /Tykkäystä. Tykkää tästä kommentista/ }).all();
    await likeButtons[commentIndex].click();
  }

  async clickOnSectionImage() {
    await this.sectionImage.click();
  }

  async showMapMarker() {
    await this.showMapMarkerButton.click();
  }

  async changeLanguage(language) {
    if (language === 'fi') {
      await this.finnishButton.click();
    } else if (language === 'sv') {
      await this.swedishButton.click();
    } else if (language === 'en') {
      await this.englishButton.click();
    }
  }
}

module.exports = { SectionViewPage }; 