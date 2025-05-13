class CookieManagementPage {
  constructor(page) {
    this.page = page;
  }

  // Navigation
  get cookieSettingsLinkEn() { return this.page.getByRole('link', { name: 'Cookie settings' }); }
  get cookieSettingsLinkFi() { return this.page.getByRole('link', { name: 'Evästeasetukset' }); }
  get cookieSettingsLinkSv() { return this.page.getByRole('link', { name: 'Cookie -inställningar' }); }

  // Language Selection
  get finnishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Suomi' }); }
  get swedishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'Svenska' }); }
  get englishButton() { return this.page.getByRole('banner').getByRole('button', { name: 'English' }); }

  // Page Content
  get headingEn() { return this.page.getByRole('heading', { name: 'Kerrokantasi uses cookies', level: 1 }); }
  get headingFi() { return this.page.getByRole('heading', { name: 'Kerrokantasi käyttää evästeitä', level: 1 }); }
  get headingSv() { return this.page.getByRole('heading', { name: 'Kerrokantasi använder kakor', level: 1 }); }

  get sectionHeadingEn() { return this.page.getByRole('heading', { name: 'About the cookies used on the website', level: 2 }); }
  get sectionHeadingFi() { return this.page.getByRole('heading', { name: 'Tietoa sivustolla käytetyistä evästeistä', level: 2 }); }
  get sectionHeadingSv() { return this.page.getByRole('heading', { name: 'Information om kakor som används på webbplatsen', level: 2 }); }

  // Cookie Preference Management
  get necessaryCookiesEn() { return this.page.getByRole('main').getByLabel('Necessary cookies').nth(0); }
  get necessaryCookiesFi() { return this.page.getByRole('main').getByLabel('Välttämättömät evästeet').nth(0); }
  get necessaryCookiesSv() { return this.page.getByRole('main').getByLabel('Nödvändig kakor').nth(0); }

  get sharedConsentEn() { return this.page.getByRole('main').getByLabel('Shared consent').nth(0); }
  get sharedConsentFi() { return this.page.getByRole('main').getByLabel('Yhteiset evästeet').nth(0); }
  get sharedConsentSv() { return this.page.getByRole('main').getByLabel('Gemensamma kakor').nth(0); }

  get optionalCookiesEn() { return this.page.getByRole('main').getByLabel('Optional cookies').nth(0); }
  get optionalCookiesFi() { return this.page.getByRole('main').getByLabel('Valinnaiset evästeet').nth(0); }
  get optionalCookiesSv() { return this.page.getByRole('main').getByLabel('Valfri kakor').nth(0); }

  get statisticsCookiesEn() { return this.page.getByRole('main').getByLabel('Statistics').nth(0); }
  get statisticsCookiesFi() { return this.page.getByRole('main').getByLabel('Tilastointi').nth(0); }
  get statisticsCookiesSv() { return this.page.getByRole('main').getByLabel('Statistik').nth(0); }

  // Information Buttons
  get sharedConsentInfoButtonEn() { return this.page.getByRole('button', { name: 'Show cookie information related to shared cookie consent' }); }
  get sharedConsentInfoButtonFi() { return this.page.getByRole('button', { name: 'Näytä yhteisiin evästesuostumuksiin liittyvien evästeiden tiedot' }); }
  get sharedConsentInfoButtonSv() { return this.page.getByRole('button', { name: 'Visa information om kakor för gemensamt samtycke' }); }

  get statisticsInfoButtonEn() { return this.page.getByRole('button', { name: 'Show cookie information related to statistics' }); }
  get statisticsInfoButtonFi() { return this.page.getByRole('button', { name: 'Näytä tilastointiin liittyvien evästeiden tiedot' }); }
  get statisticsInfoButtonSv() { return this.page.getByRole('button', { name: 'Visa information om statistikkakor' }); }

  // Save Preference Buttons
  get acceptSelectedButtonEn() { return this.page.getByRole('button', { name: 'Accept selected cookies' }); }
  get acceptSelectedButtonFi() { return this.page.getByRole('button', { name: 'Hyväksy valitut evästeet' }); }
  get acceptSelectedButtonSv() { return this.page.getByRole('button', { name: 'Acceptera valda kakor' }); }

  get acceptRequiredButtonEn() { return this.page.getByRole('button', { name: 'Accept required cookies only' }); }
  get acceptRequiredButtonFi() { return this.page.getByRole('button', { name: 'Hyväksy vain välttämättömät evästeet' }); }
  get acceptRequiredButtonSv() { return this.page.getByRole('button', { name: 'Acceptera endast nödvändiga' }); }

  // Notification
  get savedNotificationHeading() { return this.page.getByRole('region', { name: 'Notification' }).getByRole('heading', { name: 'Saved' }); }
  get savedNotificationText() { return this.page.getByRole('region', { name: 'Notification' }).getByText('Settings saved!'); }

  // Actions
  async navigateToCookiesPage() {
    await this.page.goto('/cookies');
  }

  async navigateFromHomePage() {
    await this.page.goto('/');
    await this.cookieSettingsLinkEn.click();
  }

  async switchLanguage(language) {
    switch (language.toLowerCase()) {
      case 'finnish':
        await this.finnishButton.click();
        break;
      case 'swedish':
        await this.swedishButton.click();
        break;
      case 'english':
        await this.englishButton.click();
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  async toggleStatisticsCookies(enable) {
    const currentChecked = await this.statisticsCookiesEn.isChecked();
    if ((enable && !currentChecked) || (!enable && currentChecked)) {
      await this.statisticsCookiesEn.click();
    }
  }

  async savePreferences() {
    await this.acceptSelectedButtonEn.click();
  }

  async acceptRequiredCookiesOnly() {
    await this.acceptRequiredButtonEn.click();
  }
}

module.exports = { CookieManagementPage }; 