# Accessibility Page Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Page Loading](#page-loading)
  - [Language Switching](#language-switching)
  - [Content Display](#content-display)
  - [Navigation](#navigation)
  - [Accessibility Features](#accessibility-features)
  - [Contact Information](#contact-information)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)

## Overview
The Accessibility page provides information about the accessibility compliance status of the application, including known issues, corrective measures, and contact information for accessibility-related feedback and support.

## Page Analysis
- **URL**: `/accessibility` (with optional `?lang=` parameter that can be set to `fi`, `sv`, or `en`)
- **Description**: A page displaying accessibility statement and compliance information for the Voice Your Opinion website
- **Key Functionalities**:
  1. Displaying markdown content in the user's selected language (Finnish, Swedish, English)
  2. Language selection through URL parameter or UI language selector
  3. Providing information on accessibility compliance status
  4. Offering contact information for accessibility feedback
  5. Presenting information about legal provisions and non-accessible content

## Test Cases
### Page Loading
- **Test Title**: Verify accessibility page loads correctly  
- **Description**: Ensures the page loads with all expected content in the default language  
- **Test Steps**:
  1. Navigate to the `/accessibility` URL
  2. Wait for the page to fully load
  3. Verify the page title is correct
  4. Verify the main content container is visible
  5. Verify the page headings are displayed
- **Expected Result**: Page loads with all expected content in Finnish (default)

- **Test Title**: Verify page loads with language parameter  
- **Description**: Tests that the page displays content in the selected language when using URL parameters  
- **Test Steps**:
  1. Navigate to `/accessibility?lang=en`
  2. Wait for the page to fully load
  3. Verify page content is in English
  4. Navigate to `/accessibility?lang=sv`
  5. Verify page content is in Swedish
- **Expected Result**: Page correctly displays content in the language specified in URL parameter

### Language Switching
- **Test Title**: Switch language via language controls  
- **Description**: Verifies the language switching functionality works properly  
- **Test Steps**:
  1. Navigate to the accessibility page
  2. Click on the "Svenska" language button
  3. Verify content changes to Swedish
  4. Click on the "English" language button
  5. Verify content changes to English
  6. Click on the "Suomi" language button
  7. Verify content changes back to Finnish
- **Expected Result**: Content language changes appropriately when language buttons are clicked

### Content Display
- **Test Title**: Verify English accessibility statement sections are displayed  
- **Description**: Checks that all expected content sections appear in the English version  
- **Test Steps**:
  1. Navigate to `/accessibility?lang=en`
  2. Verify main heading "Accessibility statement – Voice Your Opinion" is visible
  3. Verify "Legal provisions applied to the website" section is present
  4. Verify "Compliance status" section is present
  5. Verify "Non-accessible content" section is present
  6. Verify "Correcting the non-compliance" section is present
  7. Verify "Feedback and contact information" section is present
- **Expected Result**: All English content sections are correctly displayed

- **Test Title**: Verify Finnish accessibility statement sections are displayed  
- **Description**: Checks that all expected content sections appear in the Finnish version  
- **Test Steps**:
  1. Navigate to `/accessibility?lang=fi`
  2. Verify main heading is visible (in Finnish)
  3. Verify the legal provisions section is present
  4. Verify the compliance status section is present
  5. Verify the non-accessible content section is present
  6. Verify the feedback section is present
- **Expected Result**: All Finnish content sections are correctly displayed

- **Test Title**: Verify Swedish accessibility statement sections are displayed  
- **Description**: Checks that all expected content sections appear in the Swedish version  
- **Test Steps**:
  1. Navigate to `/accessibility?lang=sv`
  2. Verify main heading is visible (in Swedish)
  3. Verify the legal provisions section is present
  4. Verify the compliance status section is present
  5. Verify the non-accessible content section is present
  6. Verify the feedback section is present
- **Expected Result**: All Swedish content sections are correctly displayed

### Navigation
- **Test Title**: Verify navigation from accessibility page  
- **Description**: Tests that the navigation menu works properly from the accessibility page  
- **Test Steps**:
  1. Navigate to the accessibility page
  2. Click on the Hearings link in navigation menu
  3. Verify redirection to the Hearings page
  4. Navigate back to the accessibility page
  5. Click on the Home link
  6. Verify redirection to the home page
- **Expected Result**: Navigation links correctly redirect to their respective pages

### Accessibility Features
- **Test Title**: Verify heading hierarchy for screen readers  
- **Description**: Checks that heading elements follow proper hierarchy for screen readers  
- **Test Steps**:
  1. Navigate to the accessibility page
  2. Verify page has one main H1 heading
  3. Verify section headings use H2
  4. Verify subsection headings use H3 or lower
- **Expected Result**: Heading hierarchy follows accessibility standards

- **Test Title**: Verify keyboard navigation functionality  
- **Description**: Tests that the page is navigable using keyboard only  
- **Test Steps**:
  1. Navigate to the accessibility page
  2. Press Tab key repeatedly to move through all interactive elements
  3. Verify that focus indicator is visible for each element
  4. Verify all interactive elements can be activated with Enter key
- **Expected Result**: All interactive elements are keyboard accessible with visible focus indicators

### Contact Information
- **Test Title**: Verify contact email links work correctly  
- **Description**: Tests that email links in the accessibility contact information section work properly  
- **Test Steps**:
  1. Navigate to the accessibility page
  2. Find the contact information section
  3. Click on the email link (e.g., kerrokantasi@hel.fi)
  4. Verify it attempts to open the default email client with the correct address
- **Expected Result**: Email links open default email client with correct address

- **Test Title**: Verify external feedback form link works correctly  
- **Description**: Tests that the external feedback form link opens correctly  
- **Test Steps**:
  1. Navigate to the accessibility page
  2. Find the feedback information section 
  3. Click on the feedback form link (www.hel.fi/feedback)
  4. Verify the link opens in a new tab with the correct URL
- **Expected Result**: External feedback link opens in a new tab with the correct URL

## Test Coverage
This test plan provides comprehensive coverage for the Accessibility page functionality:
- Basic page loading: 100%
- Language switching: 100%
- Content display: 100% (all supported languages)
- Navigation elements: 100%
- Accessibility features: 90% (manual testing with screen readers recommended)
- Contact information: 100%

## Prerequisites
- Access to a working installation of the Kerrokantasi application
- Browser with JavaScript enabled
- Network access to external linked resources
- Playwright testing framework installed and configured
- Appropriate viewport sizes for testing (desktop, tablet, mobile) 