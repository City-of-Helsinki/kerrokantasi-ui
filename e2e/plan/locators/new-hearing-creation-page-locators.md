# New Hearing Creation Page Locators

### Authentication and Navigation

```javascript
// Login button (when not authenticated)
page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' })

// Navigation to user hearings page
page.getByRole('navigation').getByRole('link', { name: 'Omat kuulemiset' })
```

### Form Header and Controls

```javascript
// Form dialog title
page.getByRole('dialog').getByRole('heading', { name: 'Muokkaa', level: 2 })

// Help link
page.getByRole('dialog').getByRole('link', { name: 'Ohjeet' })

// Form step headings
page.getByRole('dialog').getByRole('heading', { name: '1. Kuulemisen perustiedot', level: 2 })
page.getByRole('dialog').getByRole('heading', { name: '2. Sisältö', level: 2 })
page.getByRole('dialog').getByRole('heading', { name: '3. Kartta', level: 2 })
page.getByRole('dialog').getByRole('heading', { name: '4. Julkaisutiedot', level: 2 })
page.getByRole('dialog').getByRole('heading', { name: '5. Hankkeen vaiheet', level: 2 })

// Step navigation buttons
page.getByRole('dialog').getByRole('button', { name: '1. Kuulemisen perustiedot' })
page.getByRole('dialog').getByRole('button', { name: '2. Sisältö' })
page.getByRole('dialog').getByRole('button', { name: '3. Kartta' })
page.getByRole('dialog').getByRole('button', { name: '4. Julkaisutiedot' })
page.getByRole('dialog').getByRole('button', { name: '5. Hankkeen vaiheet' })

// Form action buttons
page.getByRole('dialog').getByRole('button', { name: 'Sulje' })
page.getByRole('dialog').getByRole('button', { name: 'Peru' })
page.getByRole('dialog').getByRole('button', { name: 'Tallenna ja tarkastele luonnosta' })
page.getByRole('dialog').getByRole('button', { name: 'Jatka' })
```

### Step 1: Basic Information

```javascript
// Language selection checkboxes
page.getByRole('dialog').getByRole('checkbox', { name: 'suomeksi' })
page.getByRole('dialog').getByRole('checkbox', { name: 'ruotsiksi' })
page.getByRole('dialog').getByRole('checkbox', { name: 'englanniksi' })

// Title input fields
page.getByRole('dialog').getByRole('group', { name: 'Otsikko*' }).getByRole('textbox', { name: 'suomeksi (200 merkkiä) *' })
page.getByRole('dialog').getByRole('group', { name: 'Otsikko*' }).getByRole('textbox', { name: 'ruotsiksi (200 merkkiä) *' })
page.getByRole('dialog').getByRole('group', { name: 'Otsikko*' }).getByRole('textbox', { name: 'englanniksi (200 merkkiä) *' })

// URL/slug field
page.getByRole('dialog').getByRole('textbox', { name: 'Kuulemisen osoite (täytä osoitteen loppuosa) *' })

// Labels/tags input
page.getByRole('dialog').getByRole('combobox', { name: 'Asiasanat *' })
page.getByRole('dialog').getByRole('button', { name: 'Asiasanat: Avaa' })

// Contact persons input
page.getByRole('dialog').getByRole('combobox', { name: /Yhteyshenkilöt/ })
page.getByRole('dialog').getByRole('button', { name: 'Yhteyshenkilöt: undefined' })

// Continue button for Step 1
page.getByRole('region', { name: '1. Kuulemisen perustiedot' }).getByRole('button', { name: 'Jatka' })
```

### Step 2: Sections

```javascript
// Section region
page.getByRole('region', { name: '2. Sisältö' })

// Add section button
page.getByRole('region', { name: '2. Sisältö' }).getByRole('button', { name: 'Lisää osio' })

// Section title inputs (for each language)
page.getByRole('region', { name: '2. Sisältö' }).getByRole('textbox', { name: /Osion otsikko suomeksi/ })
page.getByRole('region', { name: '2. Sisältö' }).getByRole('textbox', { name: /Osion otsikko ruotsiksi/ })
page.getByRole('region', { name: '2. Sisältö' }).getByRole('textbox', { name: /Osion otsikko englanniksi/ })

// Section content editor
page.getByRole('region', { name: '2. Sisältö' }).getByLabel(/Osion sisältö suomeksi/)
page.getByRole('region', { name: '2. Sisältö' }).getByLabel(/Osion sisältö ruotsiksi/)
page.getByRole('region', { name: '2. Sisältö' }).getByLabel(/Osion sisältö englanniksi/)

// Image upload button
page.getByRole('region', { name: '2. Sisältö' }).getByRole('button', { name: 'Lisää kuva' })

// Attachments button
page.getByRole('region', { name: '2. Sisältö' }).getByRole('button', { name: 'Lisää liite' })

// Section commenting options
page.getByRole('region', { name: '2. Sisältö' }).getByRole('checkbox', { name: 'Kommentointi' })
page.getByRole('region', { name: '2. Sisältö' }).getByRole('checkbox', { name: 'Äänet' })

// Continue button for Step 2
page.getByRole('region', { name: '2. Sisältö' }).getByRole('button', { name: 'Jatka' })
```

### Step 3: Map

```javascript
// Map region
page.getByRole('region', { name: '3. Kartta' })

// Enable map checkbox
page.getByRole('region', { name: '3. Kartta' }).getByRole('checkbox', { name: 'Näytä kartta' })

// Map container
page.getByRole('region', { name: '3. Kartta' }).getByRole('application', { name: 'Map' })

// Add marker button
page.getByRole('region', { name: '3. Kartta' }).getByRole('button', { name: 'Lisää merkintä' })

// Upload GeoJSON button
page.getByRole('region', { name: '3. Kartta' }).getByRole('button', { name: 'Lataa GeoJSON' })

// Continue button for Step 3
page.getByRole('region', { name: '3. Kartta' }).getByRole('button', { name: 'Jatka' })
```

### Step 4: Time Settings

```javascript
// Time settings region
page.getByRole('region', { name: '4. Julkaisutiedot' })

// Opening date picker
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByLabel('Avautuu')

// Opening time picker
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByLabel('Kellonaika (avautuu)')

// Closing date picker
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByLabel('Sulkeutuu')

// Closing time picker
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByLabel('Kellonaika (sulkeutuu)')

// Closure information textareas
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByLabel('Sulkeutumistiedote suomeksi')
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByLabel('Sulkeutumistiedote ruotsiksi')
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByLabel('Sulkeutumistiedote englanniksi')

// Continue button for Step 4
page.getByRole('region', { name: '4. Julkaisutiedot' }).getByRole('button', { name: 'Jatka' })
```

### Step 5: Project Settings

```javascript
// Project settings region
page.getByRole('region', { name: '5. Hankkeen vaiheet' })

// Project dropdown
page.getByRole('region', { name: '5. Hankkeen vaiheet' }).getByRole('combobox', { name: 'Valitse hanke' })

// Add/Edit project phases
page.getByRole('region', { name: '5. Hankkeen vaiheet' }).getByRole('button', { name: 'Lisää vaihe' })
page.getByRole('region', { name: '5. Hankkeen vaiheet' }).getByRole('button', { name: 'Muokkaa vaiheita' })

// Save button
page.getByRole('dialog').getByRole('button', { name: 'Tallenna ja tarkastele luonnosta' })
```

### Form Validation Messages

```javascript
// Error messages
page.getByRole('dialog').getByText('Täytä kaikki pakolliset kentät')
page.getByRole('dialog').getByText('Tämä kenttä on pakollinen')
``` 