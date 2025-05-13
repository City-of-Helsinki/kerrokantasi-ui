# User Profile Page Locators

### Navigation and Authentication

```javascript
// Login button (when not authenticated)
page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' })

// Username/Email field in login form 
page.getByRole('textbox', { name: 'Sähköposti' })

// Password field in login form
page.getByRole('textbox', { name: 'Salasana' })

// Login submit button
page.getByRole('button', { name: 'Kirjaudu sisään' })

// Navigation to user profile
page.getByRole('navigation').getByRole('link', { name: 'Omat tiedot' })
```

### Profile Page Sections

```javascript
// Page title
page.getByRole('heading', { name: 'Omat tiedot', level: 1 })

// Favorite hearings section
page.getByRole('heading', { name: 'Suosikkikuulemiset', level: 2 })

// User comments section
page.getByRole('heading', { name: /Lisäämäni kommentit/, level: 2 })
```

### Favorite Hearings

```javascript
// Favorite hearing card titles
page.getByRole('main').getByRole('heading', { level: 3 })

// Specific favorite hearing by title
page.getByRole('main').getByRole('heading', { name: 'Kuuleminen E2E-testausta varten', level: 3 })
page.getByRole('main').getByRole('heading', { name: 'e2efix', level: 3 })

// Hearing status (closing time)
page.getByRole('main').getByText(/Sulkeutuu/)

// Hearing tags
page.getByRole('main').getByRole('link', { name: 'testi' })
page.getByRole('main').getByRole('link', { name: 'luonto' })
page.getByRole('main').getByRole('link', { name: 'test' })

// Remove from favorites button
page.getByRole('main').getByRole('button', { name: 'Poista suosikeista' })

// Empty state for no favorite hearings (not visible in current state)
page.getByRole('main').getByText(/Ei suosikkikuulemisia/)
```

### User Comments

```javascript
// Comment filter dropdown
page.getByRole('main').getByRole('button', { name: 'Valitse tietyn kuulemisen kommentit' })

// Comment filter options
page.getByRole('option', { name: 'Kaikki' })
page.getByRole('option', { name: 'Kuuleminen E2E-testausta varten' })
page.getByRole('option', { name: 'e2efix' })

// Comment sort dropdown
page.getByRole('main').getByRole('button', { name: /Järjestä/ })

// Comment sort options
page.getByRole('option', { name: 'Uusin ensin' })
page.getByRole('option', { name: 'Vanhin ensin' })

// Comment metadata
page.getByRole('main').getByText('Työntekijä')
page.getByRole('main').getByText(/kuukausi sitten/)
page.getByRole('main').getByText(/Kuulemisen tila: Avoin/)

// Comment content
page.getByRole('main').getByText('Joo')
page.getByRole('main').getByText('kommentti')

// Hearing link in comment
page.getByRole('main').getByRole('link', { name: 'Kuuleminen E2E-testausta varten' })
page.getByRole('main').getByRole('link', { name: 'e2efix' })

// Empty state for no comments (not visible in current state)
page.getByRole('main').getByText(/Ei kommentteja/)
```

### Footer Navigation 

```javascript
// Footer navigation links
page.getByRole('contentinfo').getByRole('link', { name: 'Omat tiedot' })
page.getByRole('contentinfo').getByRole('link', { name: 'Omat kuulemiset' })
``` 