# Section View Page Locators

### Navigation

```javascript
// Hearing title link at top of page
page.getByRole('heading', { name: /FluxHaven — Kausittain siirtyvä kaupunki/ })

// Back to hearing main page link
page.getByRole('link', { name: /Takaisin kuulemisen etusivulle/ })

// Section browser - subsection navigation
page.getByRole('navigation', { name: /Alaosio/ })

// Next section link
page.getByRole('link', { name: 'Seuraava' })

// Previous section link (disabled state example)
page.getByText('Epäaktiivinen linkki')
```

### Section Information

```javascript
// Section title
page.getByRole('heading', { name: /Teknologiset järjestelmät/ })

// Section subtitle (includes numbering)
page.getByRole('heading', { name: /Alaosio 1\/2 Teknologiset järjestelmät/ })

// Section abstract
page.getByRole('main').getByText(/FluxHavenin innovatiiviset teknologiset järjestelmät/)

// Section image
page.getByRole('figure', { name: 'Teknologiset järjestelmät' })

// Section comment count indicator
page.getByRole('main').getByText(/0 kommenttia/)

// Write comment link (jump to comment section)
page.getByRole('link', { name: 'Kirjoita kommentti' })
```

### Section Details

```javascript
// Heading with collapsible details
page.getByRole('heading', { level: 2 }).filter({ hasText: 'Tiedot' })

// Collapsible details button
page.getByRole('button', { name: 'Tiedot' })

// Section content region (when expanded)
page.getByRole('region').filter({ hasText: /FluxHaven/ })
```

### Attachments

```javascript
// Attachment download link
page.getByRole('link', { name: 'Lataa yhteenveto kommenteista Excel-muodossa' })
```

### Comments

```javascript
// Comments heading with count
page.getByRole('heading', { name: /Mielipiteet \d+/ })

// Comment form button
page.getByRole('button', { name: /Kirjoita kommentti/ })

// Comment sort dropdown
page.getByRole('button', { name: /Järjestä kommentit/ })

// Comment text field
page.getByRole('textbox', { name: 'Kommentti *' })

// Comment nickname field
page.getByRole('textbox', { name: 'Nimimerkki' })

// Add image to comment button
page.getByRole('button', { name: 'Lisää kuvia kommenttiisi' })

// Comment submit button
page.getByRole('button', { name: 'Lähetä' })

// Comment cancel button
page.getByRole('button', { name: 'Peru' })

// Existing comment author
page.getByText('Nimimerkin takaa')

// Comment timestamp
page.getByText(/kuukausi sitten/)

// Reply to comment button
page.getByRole('button', { name: 'Vastaa' }) 

// Like comment button
page.getByRole('button', { name: /Tykkäystä. Tykkää tästä kommentista/ })
```

### Language Selection

```javascript
// Language buttons
page.getByRole('banner').getByRole('button', { name: 'Suomi' })
page.getByRole('banner').getByRole('button', { name: 'Svenska' })
page.getByRole('banner').getByRole('button', { name: 'English' })
```

### User Actions

```javascript
// Login button
page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' })

// Vote and comment main button
page.getByRole('button', { name: /Äänestä ja kommentoi/ })
``` 