# Accessibility Page Locators

### Skip to content link
```javascript
// Skip to content links in different languages
page.getByRole('link', { name: 'Siirry pääsisältöön' }) // Finnish
page.getByRole('link', { name: 'Skip to main content' }) // English
page.getByRole('link', { name: 'Gå till huvudinnehållet' }) // Swedish
```

### Page header and logo
```javascript
// Logo/home links
page.getByRole('banner').getByRole('link', { name: 'Siirry etusivulle' }) // Finnish
page.getByRole('banner').getByRole('link', { name: 'Go to the home page' }) // English
page.getByRole('banner').getByRole('link', { name: 'Gå till hemsidan' }) // Swedish

// Site title link
page.getByRole('banner').getByRole('link', { name: 'Kerrokantasi' })
```

### Language selection
```javascript
// Language buttons
page.getByRole('button', { name: 'Suomi' })
page.getByRole('button', { name: 'Svenska' })
page.getByRole('button', { name: 'English' })
```

### Login button
```javascript
// Login button in different languages
page.getByRole('button', { name: 'Kirjaudu' }) // Finnish
page.getByRole('button', { name: 'Login' }) // English
page.getByRole('button', { name: 'Logga in' }) // Swedish
```

### Main navigation
```javascript
// Navigation links in Finnish
page.getByRole('navigation').getByRole('link', { name: 'Kuulemiset' })
page.getByRole('navigation').getByRole('link', { name: 'Kartta' })
page.getByRole('navigation').getByRole('link', { name: 'Tietoa palvelusta' })

// Navigation links in English
page.getByRole('navigation').getByRole('link', { name: 'Hearings' })
page.getByRole('navigation').getByRole('link', { name: 'Map' })
page.getByRole('navigation').getByRole('link', { name: 'About the service' })

// Navigation links in Swedish
page.getByRole('navigation').getByRole('link', { name: 'Höranden' })
page.getByRole('navigation').getByRole('link', { name: 'Karta' })
page.getByRole('navigation').getByRole('link', { name: 'Information om tjänsten' })
```

### Page headings
```javascript
// Main headings in different languages
page.getByRole('heading', { name: 'Saavutettavuusseloste – Kerrokantasi.hel.fi', level: 1 }) // Finnish
page.getByRole('heading', { name: 'Accessibility statement – Voice Your Opinion', level: 1 }) // English
page.getByRole('heading', { name: 'Tillgänglighetsutlåtande – Säg Din Åsikt', level: 1 }) // Swedish

// Section headings - Finnish examples
page.getByRole('main').getByRole('heading', { name: 'Sivustoa koskevat lain säädökset', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Vaatimustenmukaisuustilanne', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Ei-saavutettava sisältö', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Havaitut puutteet', level: 3 })
page.getByRole('main').getByRole('heading', { name: 'Palaute ja yhteystiedot', level: 2 })

// Section headings - English examples
page.getByRole('main').getByRole('heading', { name: 'Legal provisions applied to the website', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Compliance status', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Non-accessible content', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Feedback and contact information', level: 2 })

// Section headings - Swedish examples
page.getByRole('main').getByRole('heading', { name: 'Lagstiftning som gäller webbplatsen', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Fullgörandestatus', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Icke-tillgängligt innehåll', level: 2 })
page.getByRole('main').getByRole('heading', { name: 'Respons och kontaktuppgifter', level: 2 })
```

### Content verification 
```javascript
// Main content container
page.getByRole('main')

// Content paragraphs validation (example first paragraphs)
page.getByRole('main').getByText('Tämä saavutettavuusseloste koskee Helsingin kaupungin Kerro kantasi -verkkosivustoa') // Finnish
page.getByRole('main').getByText('This accessibility statement concerns the City of Helsinki\'s Voice Your Opinion website') // English
page.getByRole('main').getByText('Det här tillgänglighetsutlåtandet gäller Helsingfors stads webbplats Sig Din Åsikt') // Swedish
```

### Email links and feedback forms
```javascript
// Email links
page.getByRole('main').getByRole('link', { name: 'kerrokantasi@hel.fi' }) // Finnish and English
page.getByRole('main').getByRole('link', { name: 'helsinki.palaute@hel.fi' }) // Swedish
page.getByRole('main').getByRole('link', { name: 'heli.k.rantanen@hel.fi' }) // All languages

// Feedback links
page.getByRole('main').getByRole('link', { name: 'www.hel.fi/palaute' }) // Finnish
page.getByRole('main').getByRole('link', { name: 'www.hel.fi/feedback' }) // English
page.getByRole('main').getByRole('link', { name: 'www.hel.fi/respons' }) // Swedish
```

### Footer section
```javascript
// Footer heading
page.getByRole('contentinfo').getByRole('heading', { name: 'Kerrokantasi', level: 2 })

// Footer links
page.getByRole('contentinfo').getByRole('link', { name: 'Saavutettavuusseloste' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Accessibility Statement' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Tillgänglighetsutlåtande' }) // Swedish

page.getByRole('contentinfo').getByRole('link', { name: 'Tietosuoja' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Data Protection' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Dataskydd' }) // Swedish

page.getByRole('contentinfo').getByRole('link', { name: 'Evästeasetukset' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Cookie -inställningar' }) // Swedish

page.getByRole('contentinfo').getByRole('link', { name: 'Tietoa palvelusta' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'About the service' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Information om tjänsten' }) // Swedish

// Back to top link
page.getByRole('contentinfo').getByRole('link', { name: 'Takaisin ylös' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Back to top' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Tillbaka till toppen' }) // Swedish
```

### Accessibility Features

```javascript
// Heading hierarchy verification
page.getByRole('heading', { level: 1 }) // Should return exactly one element (main heading)
page.getByRole('heading', { level: 2 }) // Section headings
page.getByRole('heading', { level: 3 }) // Subsection headings

// Interactive elements for keyboard navigation testing
// These locators can be used with .press('Tab') to test keyboard navigation
``` 