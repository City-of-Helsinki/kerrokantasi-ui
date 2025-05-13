# Hearings Listing Page Locators

### Navigation
- **Test Title**: Verify navigation to hearings list and map views
- **Test Steps**:
  1. Navigate to the hearings list view
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Click on the map tab
     ```javascript
     page.getByRole('tab', { name: 'Kartta' })
     ```
  3. Verify URL changes to map view
     ```javascript
     page.url()
     ```
  4. Click on the list tab
     ```javascript
     page.getByRole('tab', { name: 'Lista' })
     ```

### Hearings List View
- **Test Title**: Verify list view displays hearings correctly
- **Test Steps**:
  1. Navigate to hearings list view
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Verify page heading
     ```javascript
     page.getByRole('heading', { name: 'Kaikki kuulemiset', level: 1 })
     ```
  3. Verify hearings count heading
     ```javascript
     page.getByRole('heading', { level: 2 }).filter({ hasText: /\d+ kuulemista/ })
     ```
  4. Verify a hearing item shows title
     ```javascript
     page.getByRole('main').getByRole('list').getByRole('heading', { level: 2 }).first()
     ```
  5. Verify a hearing item shows comment count
     ```javascript
     page.getByRole('main').getByRole('list').locator('li').first().getByText(/Kommentt/)
     ```
  6. Verify a hearing item shows open/close dates
     ```javascript
     page.getByRole('main').getByRole('list').locator('li').first().getByText(/Avautui/)
     page.getByRole('main').getByRole('list').locator('li').first().getByText(/Sulkeutu/)
     ```
  7. Verify a hearing item shows labels
     ```javascript
     page.getByRole('main').getByRole('list').locator('li').first().getByRole('link').filter({ hasText: /testi|tekoäly|kokeilu|luonto/ }).first()
     ```
  8. Verify closed hearings have a "Closed" tag
     ```javascript
     page.getByRole('main').getByRole('list').getByText('Sulkeutunut')
     ```
  9. Click on a hearing title
     ```javascript
     page.getByRole('main').getByRole('list').getByRole('heading', { level: 2 }).first().getByRole('link')
     ```

### Infinite Scroll Functionality
- **Test Title**: Test infinite scroll functionality
- **Test Steps**:
  1. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Scroll to the bottom of the page
     ```javascript
     page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
     ```
  3. Verify more hearings are loaded
     ```javascript
     page.getByRole('main').getByRole('list').locator('li').count()
     ```

### Hearings Map View
- **Test Title**: Verify map view displays hearings correctly
- **Test Steps**:
  1. Navigate to map view
     ```javascript
     page.goto('/hearings/map')
     ```
  2. Click on the map tab (if not already on map view)
     ```javascript
     page.getByRole('tab', { name: 'Kartta' })
     ```
  3. Verify the map loads
     ```javascript
     page.locator('.leaflet-container')
     ```
  4. Verify map markers for hearings
     ```javascript
     page.getByRole('tabpanel', { name: 'Kartta' }).getByRole('button').first()
     ```
  5. Click on a map marker
     ```javascript
     page.getByRole('tabpanel', { name: 'Kartta' }).getByRole('button').first()
     ```
  6. Verify popup shows hearing information (when implemented)
     ```javascript
     page.locator('.leaflet-popup-content')
     ```

- **Test Title**: Test "Show only open" checkbox in map view
- **Test Steps**:
  1. Navigate to map view
     ```javascript
     page.goto('/hearings/map')
     ```
  2. Observe initial map markers
     ```javascript
     page.getByRole('tabpanel', { name: 'Kartta' }).getByRole('button').count()
     ```
  3. Click "Show only open" checkbox
     ```javascript
     page.getByRole('checkbox').click()
     ```
  4. Verify text next to checkbox
     ```javascript
     page.getByText('Näytetään vain avoimet')
     ```
  5. Verify map markers are updated to show only open hearings
     ```javascript
     page.getByRole('tabpanel', { name: 'Kartta' }).getByRole('button').count()
     ```

### Hearings Filter and Search
- **Test Title**: Test title search functionality
- **Test Steps**:
  1. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Enter a search term in the search input
     ```javascript
     page.getByRole('combobox', { name: 'Etsi otsikoista' }).fill('testi')
     ```
  3. Press the search button
     ```javascript
     page.getByRole('button', { name: 'Etsi' }).click()
     ```
  4. Verify URL updates with search parameter
     ```javascript
     page.url()
     ```
  5. Verify hearings list updates to show only matching results
     ```javascript
     page.getByRole('main').getByRole('list').locator('li')
     ```

- **Test Title**: Test label filtering
- **Test Steps**:
  1. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Open the label dropdown
     ```javascript
     page.getByRole('combobox', { name: 'Hae aiheista' }).click()
     ```
  3. Select a label (depends on implementation)
     ```javascript
     page.getByText('testi').click()
     ```
  4. Verify URL updates with label parameters
     ```javascript
     page.url()
     ```
  5. Verify hearings list updates to show only hearings with selected labels
     ```javascript
     page.getByRole('main').getByRole('list').locator('li')
     ```

- **Test Title**: Test "Show only open" toggle functionality in list view
- **Test Steps**:
  1. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Click the "Show only open" filter option (if present in the UI)
     ```javascript
     page.getByText('Näytetään vain avoimet').click()
     ```
  3. Verify hearings list updates to show only open hearings
     ```javascript
     page.getByRole('main').getByRole('list').locator('li')
     ```

- **Test Title**: Test combined filters (search, labels, open status)
- **Test Steps**:
  1. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Enter a search term
     ```javascript
     page.getByRole('combobox', { name: 'Etsi otsikoista' }).fill('testi')
     ```
  3. Select a label
     ```javascript
     page.getByRole('combobox', { name: 'Hae aiheista' }).click()
     page.getByText('testi').click()
     ```
  4. Enable "Show only open" filter (if present)
     ```javascript
     page.getByText('Näytetään vain avoimet').click()
     ```
  5. Click search button
     ```javascript
     page.getByRole('button', { name: 'Etsi' }).click()
     ```
  6. Verify hearings list updates correctly with all filters applied
     ```javascript
     page.getByRole('main').getByRole('list').locator('li')
     ```

### Admin Features
- **Test Title**: Verify admin filter selector visibility
- **Test Steps**:
  1. Navigate to hearings list as a regular user
     ```javascript
     page.goto('/hearings/list')
     ```
  2. Verify admin filter selector is not visible
     ```javascript
     page.getByRole('combobox', { name: /admin/i }).isVisible()
     ```
  3. Log in as an admin user
     ```javascript
     page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' }).click()
     ```
  4. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  5. Verify admin filter selector is visible
     ```javascript
     page.getByRole('combobox', { name: /admin/i })
     ```

- **Test Title**: Test admin filter functionality
- **Test Steps**:
  1. Log in as an admin user
     ```javascript
     page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' }).click()
     ```
  2. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  3. Select different admin filter options
     ```javascript
     page.getByRole('combobox', { name: /admin/i }).click()
     page.getByText('Julkaistu').click()
     ```
  4. Verify hearings list updates according to selected filter
     ```javascript
     page.getByRole('main').getByRole('list').locator('li')
     ```

- **Test Title**: Verify "Create Hearing" button functionality
- **Test Steps**:
  1. Log in as an admin user
     ```javascript
     page.getByRole('banner').getByRole('button', { name: 'Kirjaudu' }).click()
     ```
  2. Navigate to hearings list
     ```javascript
     page.goto('/hearings/list')
     ```
  3. Verify "Create Hearing" button is visible
     ```javascript
     page.getByRole('button', { name: /Luo kuuleminen/i })
     ```
  4. Click "Create Hearing" button
     ```javascript
     page.getByRole('button', { name: /Luo kuuleminen/i }).click()
     ```
  5. Verify navigation to new hearing creation page
     ```javascript
     page.url()
     ``` 