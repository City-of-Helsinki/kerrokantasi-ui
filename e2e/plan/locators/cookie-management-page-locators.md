# Cookie Management Page Locators

### Navigation

```javascript
// Navigate to Cookie Management Page
page.getByRole('link', { name: 'Cookie settings' })
page.getByRole('link', { name: 'Evästeasetukset' }) // Finnish
page.getByRole('link', { name: 'Cookie -inställningar' }) // Swedish
```

### Language Selection

```javascript
// Language buttons
page.getByRole('banner').getByRole('button', { name: 'Suomi' })
page.getByRole('banner').getByRole('button', { name: 'Svenska' })
page.getByRole('banner').getByRole('button', { name: 'English' })
```

### Page Content

```javascript
// Page headings
page.getByRole('heading', { name: 'Kerrokantasi uses cookies', level: 1 }) // English
page.getByRole('heading', { name: 'Kerrokantasi käyttää evästeitä', level: 1 }) // Finnish
page.getByRole('heading', { name: 'Kerrokantasi använder kakor', level: 1 }) // Swedish

// Section heading
page.getByRole('heading', { name: 'About the cookies used on the website', level: 2 }) // English
page.getByRole('heading', { name: 'Tietoa sivustolla käytetyistä evästeistä', level: 2 }) // Finnish
page.getByRole('heading', { name: 'Information om kakor som används på webbplatsen', level: 2 }) // Swedish
```

### Cookie Preference Management

```javascript
// Required cookies checkboxes (always checked and disabled)
page.getByRole('main').getByLabel('Necessary cookies') // English
page.getByRole('main').getByLabel('Välttämättömät evästeet') // Finnish
page.getByRole('main').getByLabel('Nödvändig kakor') // Swedish

// Shared consent checkboxes (always checked and disabled)
page.getByRole('main').getByLabel('Shared consent') // English
page.getByRole('main').getByLabel('Yhteiset evästeet') // Finnish
page.getByRole('main').getByLabel('Gemensamma kakor') // Swedish

// Optional cookies checkboxes (can be toggled)
page.getByRole('main').getByLabel('Optional cookies') // English
page.getByRole('main').getByLabel('Valinnaiset evästeet') // Finnish
page.getByRole('main').getByLabel('Valfri kakor') // Swedish

// Statistics cookies checkboxes (can be toggled)
page.getByRole('main').getByLabel('Statistics') // English
page.getByRole('main').getByLabel('Tilastointi') // Finnish
page.getByRole('main').getByLabel('Statistik') // Swedish
```

### Information Buttons

```javascript
// Cookie information togglers
page.getByRole('button', { name: 'Show cookie information related to shared cookie consent' }) // English
page.getByRole('button', { name: 'Näytä yhteisiin evästesuostumuksiin liittyvien evästeiden tiedot' }) // Finnish
page.getByRole('button', { name: 'Visa information om kakor för gemensamt samtycke' }) // Swedish

page.getByRole('button', { name: 'Show cookie information related to statistics' }) // English
page.getByRole('button', { name: 'Näytä tilastointiin liittyvien evästeiden tiedot' }) // Finnish
page.getByRole('button', { name: 'Visa information om statistikkakor' }) // Swedish
```

### Save Preference Buttons

```javascript
// Accept cookies buttons
page.getByRole('button', { name: 'Accept selected cookies' }) // English
page.getByRole('button', { name: 'Hyväksy valitut evästeet' }) // Finnish
page.getByRole('button', { name: 'Acceptera valda kakor' }) // Swedish

page.getByRole('button', { name: 'Accept required cookies only' }) // English
page.getByRole('button', { name: 'Hyväksy vain välttämättömät evästeet' }) // Finnish
page.getByRole('button', { name: 'Acceptera endast nödvändiga' }) // Swedish
```

### Notification

```javascript
// Saved notification
page.getByRole('region', { name: 'Notification' }).getByRole('heading', { name: 'Saved' }) // English
page.getByRole('region', { name: 'Notification' }).getByText('Settings saved!') // English
``` 