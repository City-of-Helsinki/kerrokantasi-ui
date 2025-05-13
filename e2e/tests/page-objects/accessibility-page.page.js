/**
 * Page Object Model for the Accessibility page.
 */

class AccessibilityPage {

  constructor(page) {
    this.page = page;
  }

  // Navigation methods
  async open(lang = 'fi') {
    await this.page.goto(`/accessibility${lang ? '?lang=' + lang : ''}`);
  }

  async navigateToHearings() {
    await this.getFinnishHearingsLink().click();
  }

  async navigateToHome() {
    await this.getLogoLink().click();
  }

  async switchLanguage(language) {
    if (language === 'fi') {
      await this.getFinnishLanguageButton().click();
    } else if (language === 'sv') {
      await this.getSwedishLanguageButton().click();
    } else if (language === 'en') {
      await this.getEnglishLanguageButton().click();
    }
  }

  // Navigation elements
  get skipToContentLinkFi() {
    return this.page.getByRole('link', { name: 'Siirry pääsisältöön' });
  }

  get skipToContentLinkEn() {
    return this.page.getByRole('link', { name: 'Skip to main content' });
  }

  get skipToContentLinkSv() {
    return this.page.getByRole('link', { name: 'Gå till huvudinnehållet' });
  }

  getLogoLink(lang = 'fi') {
    const nameMap = {
      fi: 'Siirry etusivulle',
      en: 'Go to the home page',
      sv: 'Gå till hemsidan'
    };
    return this.page.getByRole('link', { name: nameMap[lang] });
  }

  getFinnishHearingsLink() {
    return this.page.getByRole('link', { name: 'Kuulemiset' }).first();
  }

  getEnglishHearingsLink() {
    return this.page.getByRole('link', { name: 'Hearings' });
  }

  getSwedishHearingsLink() {
    return this.page.getByRole('link', { name: 'Höranden' });
  }

  // Language controls
  getFinnishLanguageButton() {
    return this.page.getByRole('button', { name: 'Suomi' });
  }

  getSwedishLanguageButton() {
    return this.page.getByRole('button', { name: 'Svenska' });
  }

  getEnglishLanguageButton() {
    return this.page.getByRole('button', { name: 'English' });
  }

  // Page headings
  getFinnishMainHeading() {
    return this.page.getByRole('heading', { name: 'Saavutettavuusseloste – Kerrokantasi.hel.fi', level: 1 });
  }

  getEnglishMainHeading() {
    return this.page.getByRole('heading', { name: 'Accessibility statement – Voice Your Opinion', level: 1 });
  }

  getSwedishMainHeading() {
    return this.page.getByRole('heading', { name: 'Tillgänglighetsutlåtande – Säg Din Åsikt', level: 1 });
  }

  // Finnish section headings
  getFinnishSectionHeadings() {
    return {
      legalProvisions: this.page.getByRole('heading', { name: 'Sivustoa koskevat lain säädökset', level: 2 }),
      cityObjective: this.page.getByRole('heading', { name: 'Kaupungin tavoite', level: 2 }),
      complianceStatus: this.page.getByRole('heading', { name: 'Vaatimustenmukaisuustilanne', level: 2 }),
      nonAccessibleContent: this.page.getByRole('heading', { name: 'Ei-saavutettava sisältö', level: 2 }),
      observedDeficiencies: this.page.getByRole('heading', { name: 'Havaitut puutteet', level: 3 }),
      fixingDeficiencies: this.page.getByRole('heading', { name: 'Puutteiden korjaus', level: 3 }),
      accessibleInformation: this.page.getByRole('heading', { name: 'Tiedon saanti saavutettavassa muodossa', level: 2 }),
      feedbackContacts: this.page.getByRole('heading', { name: 'Palaute ja yhteystiedot', level: 2 })
    };
  }

  // English section headings
  getEnglishSectionHeadings() {
    return {
      legalProvisions: this.page.getByRole('heading', { name: 'Legal provisions applied to the website', level: 2 }),
      cityObjective: this.page.getByRole('heading', { name: 'The City\'s objective', level: 2 }),
      complianceStatus: this.page.getByRole('heading', { name: 'Compliance status', level: 2 }),
      nonAccessibleContent: this.page.getByRole('heading', { name: 'Non-accessible content', level: 2 }),
      nonComplianceCriteria: this.page.getByRole('heading', { name: 'Non-compliance with accessibility criteria', level: 2 }),
      correctingNonCompliance: this.page.getByRole('heading', { name: 'Correcting the non-compliance', level: 2 }),
      feedbackContacts: this.page.getByRole('heading', { name: 'Feedback and contact information', level: 2 }),
      reportingInaccessible: this.page.getByRole('heading', { name: 'Reporting inaccessible content', level: 2 })
    };
  }

  // Swedish section headings
  getSwedishSectionHeadings() {
    return {
      legalProvisions: this.page.getByRole('heading', { name: 'Lagstiftning som gäller webbplatsen', level: 2 }),
      cityObjective: this.page.getByRole('heading', { name: 'Stadens mål', level: 2 }),
      complianceStatus: this.page.getByRole('heading', { name: 'Fullgörandestatus', level: 2 }),
      nonAccessibleContent: this.page.getByRole('heading', { name: 'Icke-tillgängligt innehåll', level: 2, exact: true }),
      observedDeficiencies: this.page.getByRole('heading', { name: 'Observerade brister', level: 2 }),
      fixingDeficiencies: this.page.getByRole('heading', { name: 'Korrigering av bristerna', level: 2 }),
      feedbackContacts: this.page.getByRole('heading', { name: 'Respons och kontaktuppgifter', level: 2 })
    };
  }

  // Contact information
  get emailLinkKerrokantasi() {
    return this.page.getByRole('link', { name: 'kerrokantasi@hel.fi' }).first();
  }

  get emailLinkHeli() {
    return this.page.getByRole('link', { name: 'heli.k.rantanen@hel.fi' });
  }

  getTraficomEmailLink(lang = 'fi') {
    const emailMap = {
      fi: 'saavutettavuus@traficom.fi',
      en: 'saavutettavuus@avi.fi',
      sv: 'tillganglighet@traficom.fi'
    };
    return this.page.getByRole('link', { name: emailMap[lang] });
  }

  // External feedback links
  getFeedbackLink(lang = 'fi') {
    const linkMap = {
      fi: 'www.hel.fi/palaute',
      en: 'www.hel.fi/feedback',
      sv: 'www.hel.fi/respons'
    };
    return this.page.getByRole('link', { name: linkMap[lang] }).first();
  }

  // Main content container
  get mainContent() {
    return this.page.locator('main');
  }

  // Footer
  get footer() {
    return this.page.getByRole('contentinfo');
  }

  getAccessibilityFooterLink(lang = 'fi') {
    const nameMap = {
      fi: 'Saavutettavuusseloste',
      en: 'Accessibility Statement',
      sv: 'Tillgänglighetsutlåtande'
    };
    return this.page.getByRole('link', { name: nameMap[lang] });
  }

  getBackToTopLink(lang = 'fi') {
    const nameMap = {
      fi: 'Takaisin ylös',
      en: 'Back to top',
      sv: 'Tillbaka till toppen'
    };
    return this.page.getByRole('link', { name: nameMap[lang] });
  }
}

module.exports = { AccessibilityPage }; 