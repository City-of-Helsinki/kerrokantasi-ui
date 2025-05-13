# Hearing Detail Page Locators

### Header and Navigation

```javascript
// Language selection
page.getByRole('banner').getByRole('button', { name: 'Suomi' })
page.getByRole('banner').getByRole('button', { name: 'Svenska' })
page.getByRole('banner').getByRole('button', { name: 'English' })

// Login button (language-specific)
page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' }) // Finnish
page.getByRole('banner').getByRole('button', { name: 'Login' }) // English

// Main navigation links (language-specific)
page.getByRole('banner').getByRole('link', { name: 'Kuulemiset' }) // Finnish
page.getByRole('banner').getByRole('link', { name: 'Hearings' }) // English
page.getByRole('banner').getByRole('link', { name: 'Kartta' }) // Finnish
page.getByRole('banner').getByRole('link', { name: 'Map' }) // English
page.getByRole('banner').getByRole('link', { name: 'Tietoa palvelusta' }) // Finnish
page.getByRole('banner').getByRole('link', { name: 'About the service' }) // English
```

### Hearing Main Content

```javascript
// Hearing title (language-specific)
page.getByRole('heading', { name: 'FluxHaven — Kausittain siirtyvä kaupunki', level: 1 }) // Finnish
page.getByRole('heading', { name: 'FluxHaven — The Seasonally-Shifting City', level: 1 }) // English

// Abstract
page.getByRole('main').getByRole('paragraph').first()

// Timeline information
page.getByRole('main').getByText('Avautui', { exact: false }) // Finnish, "Opened"
page.getByRole('main').getByText('Opened', { exact: false }) // English
page.getByRole('main').getByText('Sulkeutuu', { exact: false }) // Finnish, "Closes"
page.getByRole('main').getByText('Closes', { exact: false }) // English

// Comment count and link
page.getByRole('main').getByText('Yhteensä 1 kommentti') // Finnish
page.getByRole('main').getByText('A total of 1 comment') // English
page.getByRole('main').getByRole('link', { name: 'Kirjoita kommentti' }) // Finnish
page.getByRole('main').getByRole('link', { name: 'Write a comment' }) // English

// Language availability links
page.getByRole('main').getByRole('link', { name: 'in English' }) // On Finnish page
page.getByRole('main').getByRole('link', { name: 'suomeksi' }) // On English page
page.getByRole('main').getByRole('link', { name: 'på svenska' }) // On Finnish/English page

// Tags section
page.getByRole('generic', { name: 'Asiasanat' }) // Finnish
page.getByRole('generic', { name: 'Tags' }) // English
page.getByRole('main').getByRole('link', { name: 'tekoäly' })
page.getByRole('main').getByRole('link', { name: 'arkkitehtuuri' })
page.getByRole('main').getByRole('link', { name: 'Ilmasto' })
```

### Hearing Details Section

```javascript
// Information toggle (expandable section)
page.getByRole('button', { name: 'Tiedot' }) // Finnish
page.getByRole('button', { name: 'Information' }) // English

// Contact persons toggle
page.getByRole('button', { name: 'Yhteyshenkilöt' }) // Finnish
page.getByRole('button', { name: 'Contact persons' }) // English

// Main image
page.getByRole('main').getByRole('figure').getByRole('img')

// Subsections heading
page.getByRole('heading', { name: 'Alaosiot (2)' }) // Finnish
page.getByRole('heading', { name: 'Subsections (2)' }) // English

// Subsection links
page.getByRole('link', { name: 'Teknologiset järjestelmät' }) // Finnish
page.getByRole('link', { name: 'Technological Systems' }) // English
page.getByRole('link', { name: 'Ekologiset ratkaisut' }) // Finnish
page.getByRole('link', { name: 'Ecological Solutions' }) // English

// Subsection action buttons
page.getByRole('button', { name: 'Näytä tiedot' }) // Finnish
page.getByRole('button', { name: 'Show details' }) // English
page.getByRole('button', { name: 'Kommentoi' }) // Finnish
page.getByRole('button', { name: 'Comment' }) // English

// Download report link
page.getByRole('link', { name: 'Lataa yhteenveto kommenteista Excel-muodossa' }) // Finnish
page.getByRole('link', { name: 'Download Excel report of all comments' }) // English
```

### Comments Section

```javascript
// Comment section heading
page.getByRole('heading', { name: /Mielipiteet/ }) // Finnish
page.getByRole('heading', { name: /Comments/ }) // English

// Comment sorting dropdown
page.getByRole('button', { name: /Järjestä kommentit/ }) // Finnish
page.getByRole('button', { name: /Order comments by/ }) // English

// Vote and comment button
page.getByRole('button', { name: /Äänestä ja kommentoi/ }) // Finnish
page.getByRole('button', { name: /Vote and write a comment/ }) // English

// Comment content
page.getByRole('list').getByRole('listitem').first()
page.getByRole('list').getByRole('listitem').getByText('Nimimerkin takaa')
page.getByRole('list').getByRole('listitem').getByText('1 kuukausi sitten') // Finnish
page.getByRole('list').getByRole('listitem').getByText('1 month ago') // English

// Comment actions
page.getByRole('button', { name: 'Vastaa' }) // Finnish, "Reply"
page.getByRole('button', { name: 'Reply' }) // English
page.getByRole('button', { name: /Tykkäystä/ }) // Finnish, "Likes"
page.getByRole('button', { name: /Likes/ }) // English

// Map marker
page.getByRole('button', { name: 'Karttamerkintä lisätty. Näytä kartta' }) // Finnish
page.getByRole('button', { name: 'Map marker added. Show on the map' }) // English
```

### Maps and Geolocation

```javascript
// Map container
page.getByRole('generic').filter({ hasText: 'Leaflet' }).first()

// Map zoom controls
page.getByRole('button', { name: 'Zoom in' })
page.getByRole('button', { name: 'Zoom out' })

// Map attribution
page.getByRole('link', { name: 'Leaflet' })
page.getByRole('link', { name: 'OpenStreetMap' })
```

### Section Page Elements

```javascript
// Back to main hearing link
page.getByRole('link', { name: 'Takaisin kuulemisen etusivulle' }) // Finnish
page.getByRole('link', { name: 'Back to hearing front page' }) // English

// Section navigation
page.getByRole('navigation').getByText('Edellinen') // Finnish, "Previous"
page.getByRole('navigation').getByText('Previous') // English
page.getByRole('navigation').getByRole('link', { name: 'Seuraava' }) // Finnish, "Next"
page.getByRole('navigation').getByRole('link', { name: 'Next' }) // English

// Write comment button in section
page.getByRole('button', { name: 'Kirjoita kommentti' }) // Finnish
page.getByRole('button', { name: 'Write a comment' }) // English
```

### Social Sharing

```javascript
// Twitter/X share
page.getByRole('link', { name: 'Post' })

// Facebook share
page.getByRole('link', { name: /Share/ })
```

### Footer

```javascript
// Footer links (language-specific)
page.getByRole('contentinfo').getByRole('link', { name: 'Saavutettavuusseloste' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Accessibility Statement' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Tietosuoja' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Data Protection' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Evästeasetukset' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Cookie settings' }) // English
page.getByRole('contentinfo').getByRole('link', { name: 'Takaisin ylös' }) // Finnish
page.getByRole('contentinfo').getByRole('link', { name: 'Back to top' }) // English
``` 