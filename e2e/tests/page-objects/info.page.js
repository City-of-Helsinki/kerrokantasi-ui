class InfoPage {

  constructor(page) {
    this.page = page;
  }

  // Navigation
  async open(language = null) {
    const url = language ? `/info?lang=${language}` : '/info';
    await this.page.goto(url);
  }

  async switchLanguage(language) {
    if (language === 'fi') {
      await this.finnishButton.click();
    } else if (language === 'sv') {
      await this.swedishButton.click();
    } else if (language === 'en') {
      await this.englishButton.click();
    }
  }

  async navigateToHearings() {
    // We'll use Finnish locator as default but could be enhanced to detect current language
    await this.hearingsLink.click();
  }

  async navigateToHome() {
    await this.logoLink.click();
  }

  async clickExternalLink(linkName) {
    const linkLocator = this.page.getByRole('link', { name: linkName });
    await linkLocator.click();
  }

  async pressTabKey() {
    await this.page.keyboard.press('Tab');
  }

  async pressEnterKey() {
    await this.page.keyboard.press('Enter');
  }

  // Skip to Content Links
  get skipToContentFi() { return this.page.getByRole('link', { name: 'Siirry pääsisältöön' }); }
  get skipToContentSv() { return this.page.getByRole('link', { name: 'Gå till huvudinnehållet' }); }
  get skipToContentEn() { return this.page.getByRole('link', { name: 'Skip to main content' }); }

  // Header and Navigation
  get logoLink() { return this.page.getByRole('link', { name: 'Kerrokantasi' }); }
  get logoLinkFi() { return this.page.getByRole('link', { name: 'Siirry etusivulle' }); }
  get logoLinkSv() { return this.page.getByRole('link', { name: 'Gå till hemsidan' }); }
  get logoLinkEn() { return this.page.getByRole('link', { name: 'Go to the home page' }); }

  // Language buttons
  get finnishButton() { return this.page.getByRole('button', { name: 'Suomi' }); }
  get swedishButton() { return this.page.getByRole('button', { name: 'Svenska' }); }
  get englishButton() { return this.page.getByRole('button', { name: 'English' }); }

  // Login buttons
  get loginButtonFi() { return this.page.getByRole('button', { name: 'Kirjaudu' }); }
  get loginButtonSv() { return this.page.getByRole('button', { name: 'Logga in' }); }
  get loginButtonEn() { return this.page.getByRole('button', { name: 'Login' }); }

  // Navigation links
  get hearingsLink() { return this.page.getByRole('navigation').getByRole('link', { name: 'Kuulemiset' }); }
  get hearingsLinkSv() { return this.page.getByRole('navigation').getByRole('link', { name: 'Höranden' }); }
  get hearingsLinkEn() { return this.page.getByRole('navigation').getByRole('link', { name: 'Hearings' }); }

  get mapLink() { return this.page.getByRole('navigation').getByRole('link', { name: 'Kartta' }); }
  get mapLinkSv() { return this.page.getByRole('navigation').getByRole('link', { name: 'Karta' }); }
  get mapLinkEn() { return this.page.getByRole('navigation').getByRole('link', { name: 'Map' }); }

  get aboutServiceLink() { return this.page.getByRole('navigation').getByRole('link', { name: 'Tietoa palvelusta' }); }
  get aboutServiceLinkSv() { return this.page.getByRole('navigation').getByRole('link', { name: 'Information om tjänsten' }); }
  get aboutServiceLinkEn() { return this.page.getByRole('navigation').getByRole('link', { name: 'About the service' }); }

  // Main Content Headings
  get mainHeadingFi() { return this.page.getByRole('heading', { name: 'Tietoa Kerrokantasi.hel.fi –palvelusta', level: 1 }); }
  get mainHeadingSv() { return this.page.getByRole('heading', { name: 'Information om tjänsten Kerrokantasi', level: 1 }); }
  get mainHeadingEn() { return this.page.getByRole('heading', { name: 'Terms of use for the Kerrokantasi service', level: 1 }); }

  // Finnish section headings
  get serviceUsageFi() { return this.page.getByRole('heading', { name: 'Palvelun käyttö', level: 2 }); }
  get dataProtectionFi() { return this.page.getByRole('heading', { name: 'Tietosuoja', level: 2 }); }
  get cookiesFi() { return this.page.getByRole('heading', { name: 'Evästeet', level: 2 }); }

  // Swedish section headings
  get serviceUsageSv() { return this.page.getByRole('heading', { name: 'Använda tjänsten', level: 2 }); }
  get dataProtectionSv() { return this.page.getByRole('heading', { name: 'Dataskyddsbeskrivning', level: 2 }); }
  get cookiesSv() { return this.page.getByRole('heading', { name: 'Om kakor', level: 2 }); }

  // English section headings
  get serviceUsageEn() { return this.page.getByRole('heading', { name: 'Using the service', level: 2 }); }
  get dataProtectionEn() { return this.page.getByRole('heading', { name: 'Data protection notices', level: 2 }); }
  get cookiesEn() { return this.page.getByRole('heading', { name: 'About cookies', level: 2 }); }

  // External links - Finnish
  get participationModelLinkFi() { return this.page.getByRole('link', { name: 'kaupungin osallisuus- ja vuorovaikutusmallia' }); }
  get feedbackLinkFi() { return this.page.getByRole('link', { name: 'https://palautteet.hel.fi' }); }
  get helsinkiProfileLinkFi() { return this.page.getByRole('link', { name: 'Helsinki-profiili-palvelussa' }); }
  get privacyPolicyLinkFi() { return this.page.getByRole('link', { name: 'www.hel.fi/tietosuoja' }); }

  // External links - Swedish
  get participationModelLinkSv() { return this.page.getByRole('link', { name: 'stadens modell för delaktighet och interaktion' }); }
  get feedbackLinkSv() { return this.page.getByRole('link', { name: 'följa responslänken' }); }
  get helsinkiProfileLinkSv() { return this.page.getByRole('link', { name: 'Helsinki Profile-tjänsten' }); }

  // External links - English
  get participationModelLinkEn() { return this.page.getByRole('link', { name: 'the City\'s participation and interaction model' }); }
  get feedbackLinkEn() { return this.page.getByRole('link', { name: 'https://palautteet.hel.fi/en' }); }
  get helsinkiProfileLinkEn() { return this.page.getByRole('link', { name: 'Helsinki Profile service' }); }

  // Footer elements
  get footerTitle() { return this.page.getByRole('contentinfo').getByRole('heading', { name: 'Kerrokantasi', level: 2 }); }

  // Footer links - Finnish
  get footerHearingsLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Kuulemiset' }); }
  get footerMapLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Kartta' }); }
  get footerAccessibilityLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Saavutettavuusseloste' }); }
  get footerPrivacyLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Tietosuoja' }); }
  get footerCookieSettingsLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Evästeasetukset' }); }
  get footerAboutServiceLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Tietoa palvelusta' }); }
  get backToTopLinkFi() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Takaisin ylös' }); }

  // Footer links - Swedish and English versions omitted for brevity
  get backToTopLinkSv() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Tillbaka till toppen' }); }
  get backToTopLinkEn() { return this.page.getByRole('contentinfo').getByRole('link', { name: 'Back to top' }); }

  // Main content container
  get mainContent() { return this.page.locator('main'); }
}

module.exports = { InfoPage }; 