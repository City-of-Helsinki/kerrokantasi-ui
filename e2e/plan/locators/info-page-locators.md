# Info Page Locators

### Skip to Main Content
```javascript
// Skip to main content link - language specific
page.getByRole('link', { name: 'Siirry pääsisältöön' }) // Finnish
page.getByRole('link', { name: 'Gå till huvudinnehållet' }) // Swedish
page.getByRole('link', { name: 'Skip to main content' }) // English
```

### Header and Navigation
```javascript
// Logo links
page.getByRole('link', { name: 'Siirry etusivulle' }) // Finnish
page.getByRole('link', { name: 'Gå till hemsidan' }) // Swedish
page.getByRole('link', { name: 'Go to the home page' }) // English

// Site title 
page.getByRole('link', { name: 'Kerrokantasi' })

// Language switchers
page.getByRole('button', { name: 'Suomi' })
page.getByRole('button', { name: 'Svenska' })
page.getByRole('button', { name: 'English' })

// Login button - language specific
page.getByRole('button', { name: 'Kirjaudu' }) // Finnish
page.getByRole('button', { name: 'Logga in' }) // Swedish
page.getByRole('button', { name: 'Login' }) // English

// Navigation menu items - language specific
page.getByRole('navigation').getByRole('link', { name: 'Kuulemiset' }) // Finnish
page.getByRole('navigation').getByRole('link', { name: 'Höranden' }) // Swedish
page.getByRole('navigation').getByRole('link', { name: 'Hearings' }) // English

page.getByRole('navigation').getByRole('link', { name: 'Kartta' }) // Finnish
page.getByRole('navigation').getByRole('link', { name: 'Karta' }) // Swedish
page.getByRole('navigation').getByRole('link', { name: 'Map' }) // English

page.getByRole('navigation').getByRole('link', { name: 'Tietoa palvelusta' }) // Finnish
page.getByRole('navigation').getByRole('link', { name: 'Information om tjänsten' }) // Swedish
page.getByRole('navigation').getByRole('link', { name: 'About the service' }) // English
```

### Main Content - Page Titles
```javascript
// Main page heading - language specific
page.getByRole('heading', { name: 'Tietoa Kerrokantasi.hel.fi –palvelusta', level: 1 }) // Finnish
page.getByRole('heading', { name: 'Information om tjänsten Kerrokantasi', level: 1 }) // Swedish
page.getByRole('heading', { name: 'Terms of use for the Kerrokantasi service', level: 1 }) // English

// Main content sections - Finnish
page.getByRole('heading', { name: 'Palvelun käyttö', level: 2 }) // Service usage section
page.getByRole('heading', { name: 'Tietosuoja', level: 2 }) // Data protection section
page.getByRole('heading', { name: 'Evästeet', level: 2 }) // Cookies section

// Main content sections - Swedish
page.getByRole('heading', { name: 'Använda tjänsten', level: 2 }) // Using the service section
page.getByRole('heading', { name: 'Dataskyddsbeskrivning', level: 2 }) // Data protection section
page.getByRole('heading', { name: 'Om kakor', level: 2 }) // Cookies section

// Main content sections - English
page.getByRole('heading', { name: 'Using the service', level: 2 }) // Using the service section
page.getByRole('heading', { name: 'Data protection notices', level: 2 }) // Data protection section
page.getByRole('heading', { name: 'About cookies', level: 2 }) // Cookies section
```

### External Links
```javascript
// Common external links in content - Finnish
page.getByRole('link', { name: 'kaupungin osallisuus- ja vuorovaikutusmallia' })
page.getByRole('link', { name: 'https://palautteet.hel.fi' })
page.getByRole('link', { name: 'Helsinki-profiili-palvelussa' })
page.getByRole('link', { name: 'www.hel.fi/tietosuoja' })

// Common external links in content - Swedish
page.getByRole('link', { name: 'stadens modell för delaktighet och interaktion' })
page.getByRole('link', { name: 'följa responslänken' })
page.getByRole('link', { name: 'Helsinki Profile-tjänsten' })

// Common external links in content - English
page.getByRole('link', { name: 'the City\'s participation and interaction model' })
page.getByRole('link', { name: 'https://palautteet.hel.fi/en' })
page.getByRole('link', { name: 'Helsinki Profile service' })
```

### Footer
```javascript
// Footer links - language specific 
page.getByRole('contentinfo').getByRole('heading', { name: 'Kerrokantasi', level: 2 })

// Standard footer links
page.getByRole('contentinfo').getByRole('link', { name: 'Kuulemiset' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Höranden' }) // Swedish
page.getByRole('contentinfo').getByRole('link', { name: 'Hearings' }) // English

page.getByRole('contentinfo').getByRole('link', { name: 'Kartta' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Karta' }) // Swedish
page.getByRole('contentinfo').getByRole('link', { name: 'Map' }) // English

// Service info links - language specific
page.getByRole('contentinfo').getByRole('link', { name: 'Saavutettavuusseloste' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Tillgänglighetsutlåtande' }) // Swedish
page.getByRole('contentinfo').getByRole('link', { name: 'Accessibility Statement' }) // English

page.getByRole('contentinfo').getByRole('link', { name: 'Tietosuoja' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Dataskydd' }) // Swedish
page.getByRole('contentinfo').getByRole('link', { name: 'Data Protection' }) // English

page.getByRole('contentinfo').getByRole('link', { name: 'Evästeasetukset' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Cookie -inställningar' }) // Swedish
page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }) // English

page.getByRole('contentinfo').getByRole('link', { name: 'Tietoa palvelusta' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Information om tjänsten' }) // Swedish
page.getByRole('contentinfo').getByRole('link', { name: 'About the service' }) // English

// Back to top link - language specific
page.getByRole('contentinfo').getByRole('link', { name: 'Takaisin ylös' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Tillbaka till toppen' }) // Swedish
page.getByRole('contentinfo').getByRole('link', { name: 'Back to top' }) // English
``` 