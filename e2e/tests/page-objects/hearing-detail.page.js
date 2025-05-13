class HearingDetailPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation
  async open(hearingSlug) {
    await this.page.goto(`/${hearingSlug}`);
  }

  // Header and Navigation
  get languageFinnishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Suomi' }); }
  get languageSwedishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Svenska' }); }
  get languageEnglishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'English' }); }
  get loginButtonFi() { return this.page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' }); }
  get loginButtonEn() { return this.page.getByRole('banner').getByRole('button', { name: 'Login' }); }
  get hearingsLinkFi() { return this.page.getByRole('banner').getByRole('link', { name: 'Kuulemiset' }); }
  get hearingsLinkEn() { return this.page.getByRole('banner').getByRole('link', { name: 'Hearings' }); }
  get mapLinkFi() { return this.page.getByRole('banner').getByRole('link', { name: 'Kartta' }); }
  get mapLinkEn() { return this.page.getByRole('banner').getByRole('link', { name: 'Map' }); }
  get aboutServiceLinkFi() { return this.page.getByRole('banner').getByRole('link', { name: 'Tietoa palvelusta' }); }
  get aboutServiceLinkEn() { return this.page.getByRole('banner').getByRole('link', { name: 'About the service' }); }

  // Hearing Main Content
  getHearingTitle(title) { return this.page.getByRole('heading', { name: title, level: 1 }); }
  get abstract() { return this.page.getByRole('main').getByRole('paragraph').first(); }
  get timelineOpenedFi() { return this.page.getByRole('main').getByText('Avautui', { exact: false }); }
  get timelineOpenedEn() { return this.page.getByRole('main').getByText('Opened', { exact: false }); }
  get timelineClosesFi() { return this.page.getByRole('main').getByText('Sulkeutuu', { exact: false }); }
  get timelineClosesEn() { return this.page.getByRole('main').getByText('Closes', { exact: false }); }
  get commentCountFi() { return this.page.getByRole('main').getByText('Yhteensä', { exact: false }); }
  get commentCountEn() { return this.page.getByRole('main').getByText('A total of', { exact: false }); }
  get writeCommentLinkFi() { return this.page.getByRole('main').getByRole('link', { name: 'Kirjoita kommentti' }); }
  get writeCommentLinkEn() { return this.page.getByRole('main').getByRole('link', { name: 'Write a comment' }); }
  get languageLinkEnglish() { return this.page.getByRole('main').getByRole('link', { name: 'in English' }); }
  get languageLinkFinnish() { return this.page.getByRole('main').getByRole('link', { name: 'suomeksi' }); }
  get languageLinkSwedish() { return this.page.getByRole('main').getByRole('link', { name: 'på svenska' }); }
  get tagsContainerFi() { return this.page.getByRole('link', { name: /tekoäly|arkkitehtuuri|Ilmasto/ }).first(); }
  get tagsContainerEn() { return this.page.getByRole('link', { name: /AI|architecture|Climate/ }).first(); }
  getTagLink(tagName) { return this.page.getByRole('main').getByRole('link', { name: tagName }); }

  // Hearing Details Section
  get informationToggleFi() { return this.page.locator('button:has-text("Tiedot")').first(); }
  get informationToggleEn() { return this.page.getByRole('button', { name: 'Information' }); }
  get contactPersonsToggleFi() { return this.page.locator('button:has-text("Yhteyshenkilöt")').first(); }
  get contactPersonsToggleEn() { return this.page.getByRole('button', { name: 'Contact persons' }); }
  get mainImage() { return this.page.getByRole('main').getByRole('figure').getByRole('img'); }
  get subsectionsHeadingFi() { return this.page.getByRole('heading', { name: 'Alaosiot', exact: false }); }
  get subsectionsHeadingEn() { return this.page.getByRole('heading', { name: 'Subsections', exact: false }); }
  getSectionLink(sectionName) { return this.page.getByRole('link', { name: sectionName }); }
  get showDetailsFi() { return this.page.getByRole('button', { name: 'Näytä tiedot' }); }
  get showDetailsEn() { return this.page.getByRole('button', { name: 'Show details' }); }
  get commentButtonFi() { return this.page.getByRole('button', { name: 'Kommentoi' }); }
  get commentButtonEn() { return this.page.getByRole('button', { name: 'Comment' }); }
  get downloadReportLinkFi() { return this.page.getByRole('link', { name: 'Lataa yhteenveto kommenteista Excel-muodossa' }); }
  get downloadReportLinkEn() { return this.page.getByRole('link', { name: 'Download Excel report of all comments' }); }

  // Comments Section
  get commentsHeadingFi() { return this.page.getByRole('heading', { name: /Mielipiteet/ }); }
  get commentsHeadingEn() { return this.page.getByRole('heading', { name: /Comments/ }); }
  get commentsHeadingSv() { return this.page.getByRole('heading', { name: /Åsikter/ }); }
  get commentSortingDropdownFi() { return this.page.getByRole('button', { name: /Järjestä kommentit/ }); }
  get commentSortingDropdownEn() { return this.page.getByRole('button', { name: /Order comments by/ }); }
  get voteAndCommentButtonFi() { return this.page.getByRole('button', { name: /Äänestä ja kommentoi/ }); }
  get voteAndCommentButtonEn() { return this.page.getByRole('button', { name: /Vote and write a comment/ }); }
  get firstComment() { return this.page.getByRole('list').getByRole('listitem').first(); }
  get anonymousCommentPrefix() { return this.page.getByRole('list').getByRole('listitem').getByText('Nimimerkin takaa'); }
  get commentPostTimeFi() { return this.page.getByRole('list').getByRole('listitem').first().getByText(/kuukausi|päivä|viikko|tunti|minuutti/); }
  get commentPostTimeEn() { return this.page.getByRole('list').getByRole('listitem').first().getByText(/month|day|week|hour|minute/); }
  get replyButtonFi() { return this.page.getByRole('button', { name: 'Vastaa' }); }
  get replyButtonEn() { return this.page.getByRole('button', { name: 'Reply' }); }
  get likesButtonFi() { return this.page.getByRole('button', { name: /Tykkäystä/ }); }
  get likesButtonEn() { return this.page.getByRole('button', { name: /Likes/ }); }
  get mapMarkerButtonFi() { return this.page.getByRole('button', { name: 'Karttamerkintä lisätty. Näytä kartta' }); }
  get mapMarkerButtonEn() { return this.page.getByRole('button', { name: 'Map marker added. Show on the map' }); }

  // Maps and Geolocation
  get mapContainer() { return this.page.locator('.hidden-xs > .hearing-map-container > .hearing-map > .leaflet-container') }
  get mapZoomInButton() { return this.page.getByRole('button', { name: 'Zoom in' }); }
  get mapZoomOutButton() { return this.page.getByRole('button', { name: 'Zoom out' }); }
  get mapLeafletLink() { return this.page.getByRole('link', { name: 'Leaflet' }); }
  get mapOpenStreetMapLink() { return this.page.getByRole('link', { name: 'OpenStreetMap' }); }

  // Section Page Elements
  get backToHearingLinkFi() { return this.page.getByRole('link', { name: 'Takaisin kuulemisen etusivulle' }); }
  get backToHearingLinkEn() { return this.page.getByRole('link', { name: 'Back to hearing front page' }); }
  get previousNavigationFi() { return this.page.getByRole('navigation').getByText('Edellinen'); }
  get previousNavigationEn() { return this.page.getByRole('navigation').getByText('Previous'); }
  get nextNavigationLinkFi() { return this.page.getByRole('navigation').getByRole('link', { name: 'Seuraava' }); }
  get nextNavigationLinkEn() { return this.page.getByRole('navigation').getByRole('link', { name: 'Next' }); }
  get writeCommentButtonFi() { return this.page.getByRole('link', { name: 'Kirjoita kommentti' }); }
  get writeCommentButtonEn() { return this.page.getByRole('link', { name: 'Write a comment' }); }

  // Social Sharing
  get twitterShareLink() { return this.page.frameLocator('iframe[title*="Twitter"]').getByRole('link', { name: 'Post' }); }
  get facebookShareLink() { return this.page.frameLocator('iframe[data-testid*="fb:share_button"]').getByRole('link', { name: /Share/ }); }
  get twitterShareFrame() { return this.page.locator('iframe[id="twitter-widget-0"]'); }
  get facebookShareFrame() { return this.page.locator('iframe[data-testid="fb:share_button Facebook Social Plugin"]'); }

  // Footer
  get accessibilityStatementLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Saavutettavuusseloste' }); }
  get accessibilityStatementLinkEn() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Accessibility Statement' }); }
  get dataProtectionLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Tietosuoja' }); }
  get dataProtectionLinkEn() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Data Protection' }); }
  get cookieSettingsLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Evästeasetukset' }); }
  get cookieSettingsLinkEn() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }); }
  get backToTopLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Takaisin ylös' }); }
  get backToTopLinkEn() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Back to top' }); }

  // Additional actions
  async changeLanguage(language) {
    if (language === 'fi') {
      await this.languageFinnishButton.click();
    } else if (language === 'sv') {
      await this.languageSwedishButton.click();
    } else if (language === 'en') {
      await this.languageEnglishButton.click();
    }
  }

  async navigateToSection(sectionName) {
    await this.getSectionLink(sectionName).click();
  }

  async toggleInformationSection(language = 'fi') {
    if (language === 'fi') {
      await this.informationToggleFi.click();
    } else {
      await this.informationToggleEn.click();
    }
  }

  async toggleContactPersonsSection(language = 'fi') {
    if (language === 'fi') {
      await this.contactPersonsToggleFi.click();
    } else {
      await this.contactPersonsToggleEn.click();
    }
  }

  async voteForComment() {
    await this.page.locator('.hearing-comment-votes').getByRole('button').first().click();
  }

  async writeComment(text) {
    // First click the vote and comment button to open the comment form
    await this.page.getByRole('button', { name: /Äänestä ja kommentoi|Vote and write a comment/ }).click();
    // Then fill the comment textbox
    await this.page.getByRole('textbox', { name: /Kommentti|Comment/ }).fill(text);

    // Only click the "Hide name" checkbox if it's visible
    const hideNameCheckbox = this.page.getByRole('checkbox', { name: 'Piilota nimi' });
    if (await hideNameCheckbox.isVisible()) {
      await hideNameCheckbox.click();
    }

    // Then click the submit button, which is labeled "Lähetä" in Finnish and "Submit" in English
    await this.page.getByRole('button', { name: /Lähetä|Submit/ }).click();
  }

  async sortComments(sortOption) {
    // Check for the Finnish or English dropdown, depending on which one is visible
    const fiDropdown = await this.commentSortingDropdownFi.isVisible();
    const enDropdown = await this.commentSortingDropdownEn.isVisible();

    if (fiDropdown) {
      await this.commentSortingDropdownFi.click();
    } else if (enDropdown) {
      await this.commentSortingDropdownEn.click();
    } else {
      throw new Error('Comment sorting dropdown not found in any language');
    }

    await this.page.getByRole('option', { name: sortOption }).click();
  }

  async flagComment() {
    await this.page.locator(`[data-testid="flag-comment"]`).first().click();
  }

  async addToFavorites() {
    await this.page.getByRole('button', { name: /Lisää suosikkeihin|Add to favorites/ }).click();
  }

  async removeFromFavorites() {
    await this.page.getByRole('button', { name: /Poista suosikeista|Remove from favorites/ }).click();
  }

  async shareOnSocialMedia(platform) {
    if (platform === 'twitter') {
      await this.twitterShareLink.click();
    } else if (platform === 'facebook') {
      await this.facebookShareLink.click();
    }
  }

  /**
   * Checks if a comment with the specified text is visible in the comments list
   * @param {string} commentText - The text to look for in the comments
   * @returns {Promise<boolean>} - Whether the comment is visible
   */
  async isCommentVisible(commentText) {
    try {
      // Get all comments
      const comments = await this.page.getByRole('list').getByRole('listitem').all();

      // For each comment, check if it contains the specified text
      for (const comment of comments) {
        const text = await comment.textContent();
        if (text.includes(commentText)) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking for comment visibility:', error);
      return false;
    }
  }

  async showMapMarker() {
    if (await this.mapMarkerButtonFi.isVisible()) {
      await this.mapMarkerButtonFi.click();
    } else if (await this.mapMarkerButtonEn.isVisible()) {
      await this.mapMarkerButtonEn.click();
    }
  }

  async zoomInMap() {
    await this.mapZoomInButton.click();
  }

  async zoomOutMap() {
    await this.mapZoomOutButton.click();
  }
}

module.exports = { HearingDetailPage }; 