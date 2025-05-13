# User Hearings Page Locators

### Navigation and Authentication

```javascript
// Login button (when not authenticated)
page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' })

// Logout button
page.getByRole('button', { name: 'Kirjaudu ulos' })

// Navigation to user hearings page 
page.getByRole('navigation').getByRole('link', { name: 'Omat kuulemiset' })

// Navigation to user profile page
page.getByRole('navigation').getByRole('link', { name: 'Omat tiedot' })
```

### Page Header and Actions

```javascript
// Page title
page.getByRole('heading', { name: 'Omat kuulemiset', level: 1 })

// Create hearing button
page.getByRole('link', { name: 'Luo uusi kuuleminen' })
page.getByRole('button', { name: 'Luo uusi kuuleminen' })

// Tools button
page.getByRole('button', { name: 'Työkalupalkki' })
```

### Filtering and Sorting

```javascript
// Sort dropdown
page.getByRole('main').getByRole('button', { name: /Järjestä/ })

// Sort options
page.getByRole('option', { name: 'Uusimmat ensin' })
page.getByRole('option', { name: 'Vanhimmat ensin' })
page.getByRole('option', { name: 'Viimeisenä sulkeutuvat' })
page.getByRole('option', { name: 'Ensimmäisenä sulkeutuvat' })
page.getByRole('option', { name: 'Eniten kommentoidut' })
page.getByRole('option', { name: 'Vähiten kommentoidut' })

// View options
page.getByRole('main').getByText('Näytä')
page.getByRole('radio', { name: 'Näytä Organisaation kuulemiset' })
page.getByRole('radio', { name: 'Näytä Omat kuulemiset' })
```

### Hearing Section Headers

```javascript
// Section headers
page.getByRole('main').getByRole('heading', { name: /Luonnokset/, level: 2 })
page.getByRole('main').getByRole('heading', { name: /Julkaisua odottavat/, level: 2 })
page.getByRole('main').getByRole('heading', { name: /Avoimet/, level: 2 })
page.getByRole('main').getByRole('heading', { name: /Sulkeutuneet/, level: 2 })
```

### Hearing Cards

```javascript
// Hearing titles
page.getByRole('main').getByRole('heading', { level: 3 })

// Specific hearing titles by name
page.getByRole('main').getByRole('heading', { name: 'testi', level: 3 })
page.getByRole('main').getByRole('heading', { name: 'End-to-End Testaus', level: 3 })
page.getByRole('main').getByRole('heading', { name: 'kuulostelu', level: 3 })
page.getByRole('main').getByRole('heading', { name: 'FluxHaven — Kausittain siirtyvä kaupunki', level: 3 })
page.getByRole('main').getByRole('heading', { name: 'Sulkeutunut kuuleminen', level: 3 })

// Hearing links
page.getByRole('main').getByRole('link', { name: 'testi' })
page.getByRole('main').getByRole('link', { name: 'End-to-End Testaus' })
page.getByRole('main').getByRole('link', { name: 'kuulostelu' })
page.getByRole('main').getByRole('link', { name: 'FluxHaven — Kausittain siirtyvä kaupunki' })
page.getByRole('main').getByRole('link', { name: 'Sulkeutunut kuuleminen' })

// Hearing status texts
page.getByRole('main').getByText(/Sulkeutuu/)
page.getByRole('main').getByText(/Sulkeutui/)

// Specific status messages
page.getByRole('main').getByText('Sulkeutuu 30.04. klo 23.59')
page.getByRole('main').getByText('Sulkeutuu 31.01. klo 09.17')
page.getByRole('main').getByText('Sulkeutuu 30.04. klo 07.31')
page.getByRole('main').getByText('Sulkeutui 28.04. klo 09.06')
page.getByRole('main').getByText('Sulkeutui 02.05. klo 10.21')

// Comment count
page.getByRole('main').getByText(/Kommentti/)

// Hearing tags
page.getByRole('main').getByRole('link', { name: 'testi' })
page.getByRole('main').getByRole('link', { name: 'tekoäly' })
page.getByRole('main').getByRole('link', { name: 'arkkitehtuuri' })
page.getByRole('main').getByRole('link', { name: 'Ilmasto' })
```

### Footer Navigation

```javascript
// Footer navigation links
page.getByRole('contentinfo').getByRole('link', { name: 'Omat kuulemiset' })
page.getByRole('contentinfo').getByRole('link', { name: 'Omat tiedot' })
page.getByRole('contentinfo').getByRole('link', { name: 'Kuulemiset' })
page.getByRole('contentinfo').getByRole('link', { name: 'Kartta' })
page.getByRole('contentinfo').getByRole('link', { name: 'Saavutettavuusseloste' })
page.getByRole('contentinfo').getByRole('link', { name: 'Tietosuoja' })
page.getByRole('contentinfo').getByRole('link', { name: 'Evästeasetukset' })
page.getByRole('contentinfo').getByRole('link', { name: 'Tietoa palvelusta' })
``` 