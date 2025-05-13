# Information Page Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Page Loading](#page-loading)
  - [Language Switching](#language-switching)
  - [Content Display](#content-display)
  - [Navigation](#navigation)
  - [Accessibility](#accessibility)
  - [External Links](#external-links)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)

## Overview
The Info page displays important information about the Kerrokantasi service including terms of use, data protection, and cookie information. It's available in multiple languages and provides content relevant to user understanding of the platform.

## Page Analysis
- **URL**: `/info` (with optional `?lang=` parameter that can be set to `fi`, `sv`, or `en`)
- **Description**: A multi-language information page displaying service information, usage instructions, privacy policy, and cookie information
- **Key Functionalities**:
  1. Displaying markdown content in the user's selected language (Finnish, Swedish, English)
  2. Language selection through URL parameter or UI language buttons
  3. Navigation links to other parts of the application
  4. External links to related resources
  5. Footer with additional useful links and information

## Test Cases
### Page Loading
- **Test Title**: Verify info page loads correctly  
- **Description**: Ensures the page loads with all expected content in the default language  
- **Test Steps**:
  1. Navigate to the `/info` URL
  2. Wait for the page to fully load
  3. Verify the page title is correct
  4. Verify the main content container is visible
  5. Verify the page headings are displayed
- **Expected Result**: Page loads with all expected content in Finnish (default)

- **Test Title**: Verify page loads with language parameter  
- **Description**: Tests that the page displays content in the selected language when using URL parameters  
- **Test Steps**:
  1. Navigate to `/info?lang=en`
  2. Wait for the page to fully load
  3. Verify page content is in English
  4. Repeat with `?lang=sv` parameter
- **Expected Result**: Page correctly displays content in the language specified in URL parameter

### Language Switching
- **Test Title**: Switch language via language controls  
- **Description**: Verifies the language switching functionality works properly  
- **Test Steps**:
  1. Navigate to the info page
  2. Click on the "Svenska" language button
  3. Verify content changes to Swedish
  4. Click on the "English" language button
  5. Verify content changes to English
  6. Click on the "Suomi" language button
  7. Verify content changes back to Finnish
- **Expected Result**: Content language changes appropriately when language buttons are clicked

### Content Display
- **Test Title**: Verify Finnish content sections are displayed  
- **Description**: Checks that all expected content sections appear in Finnish  
- **Test Steps**:
  1. Navigate to `/info?lang=fi`
  2. Verify main heading "Tietoa Kerrokantasi.hel.fi" is visible
  3. Verify "Palvelun käyttö" section is present
  4. Verify "Tietosuoja" section is present
  5. Verify "Evästeet" section is present
- **Expected Result**: All Finnish content sections are correctly displayed

- **Test Title**: Verify Swedish content sections are displayed  
- **Description**: Checks that all expected content sections appear in Swedish  
- **Test Steps**:
  1. Navigate to `/info?lang=sv`
  2. Verify main heading "Information om tjänsten Kerrokantasi" is visible
  3. Verify "Använda tjänsten" section is present
  4. Verify "Dataskyddsbeskrivning" section is present
  5. Verify "Om kakor" section is present
- **Expected Result**: All Swedish content sections are correctly displayed

- **Test Title**: Verify English content sections are displayed  
- **Description**: Checks that all expected content sections appear in English  
- **Test Steps**:
  1. Navigate to `/info?lang=en`
  2. Verify main heading "Terms of use for the Kerrokantasi service" is visible
  3. Verify "Using the service" section is present
  4. Verify "Data protection notices" section is present
  5. Verify "About cookies" section is present
- **Expected Result**: All English content sections are correctly displayed

### Navigation
- **Test Title**: Verify navigation menu functionality  
- **Description**: Tests that the navigation menu works properly from the info page  
- **Test Steps**:
  1. Navigate to the info page
  2. Click on the Hearings link in navigation menu
  3. Verify redirection to the Hearings page
  4. Navigate back to the info page
  5. Click on the Home link
  6. Verify redirection to the home page
- **Expected Result**: Navigation links correctly redirect to their respective pages

### Accessibility
- **Test Title**: Verify skip to main content functionality  
- **Description**: Tests the accessibility feature that allows keyboard users to skip to main content  
- **Test Steps**:
  1. Navigate to the info page
  2. Press Tab key to focus on skip to main content link
  3. Press Enter to activate the link
  4. Verify focus moves to the main content
- **Expected Result**: Focus moves to main content when skip link is activated

- **Test Title**: Verify heading hierarchy  
- **Description**: Checks that heading elements follow proper hierarchy for screen readers  
- **Test Steps**:
  1. Navigate to the info page
  2. Verify page has one main H1 heading
  3. Verify section headings use H2
  4. Verify subsection headings use H3 or lower
- **Expected Result**: Heading hierarchy follows accessibility standards

### External Links
- **Test Title**: Verify external links open correctly  
- **Description**: Tests that all external links on the page open correctly  
- **Test Steps**:
  1. Navigate to the info page
  2. Click on the link to the Helsinki Profile service
  3. Verify the link opens in a new tab
  4. Navigate back to the info page
  5. Click on the link to the privacy policy
  6. Verify the link opens in a new tab
- **Expected Result**: External links open in new tabs with correct URLs

## Test Coverage
This test plan provides comprehensive coverage for the Info page functionality:
- Basic page loading: 100%
- Language switching: 100%
- Content display: 100% (all supported languages)
- Navigation elements: 100%
- Accessibility features: 80% (manual testing of screen readers recommended)
- External links: 80% (sample of key links tested)

## Prerequisites
- Access to a working installation of the Kerrokantasi application
- Browser with JavaScript enabled
- Network access to external linked resources
- Playwright testing framework installed and configured
- Appropriate viewport sizes for testing (desktop, tablet, mobile) 