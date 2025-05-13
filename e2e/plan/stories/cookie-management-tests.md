# Cookie Management Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Cookie Management Page Navigation](#cookie-management-page-navigation)
  - [Language Selection](#language-selection)
  - [Cookie Preference Management](#cookie-preference-management)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)

## Overview
The Cookie Management page allows users to view and modify their cookie consent preferences. This feature provides transparency and control over what data the application collects, supporting compliance with data privacy regulations.

## Page Analysis
- **URL**: `/cookies`
- **Description**: Dedicated page for managing cookie preferences
- **Key Functionalities**:
  1. Displaying cookie information and policies
  2. Allowing users to toggle cookie consent preferences
  3. Supporting multilingual content (language switching)
  4. Saving user preferences when changes are made

## Test Cases
### Cookie Management Page Navigation
- **Test Title**: Navigate to Cookie Management page  
- **Description**: Verify that the Cookie Management page can be accessed directly via URL  
- **Test Steps**:
  1. Navigate to the application's home page
  2. Navigate to the `/cookies` URL
  3. Observe the page content
- **Expected Result**: The Cookie Management page loads with cookie information and preference controls

### Language Selection
- **Test Title**: Switch language on Cookie Management page  
- **Description**: Verify that users can change the language of the cookie management content  
- **Test Steps**:
  1. Navigate to the Cookie Management page
  2. Identify the language switcher
  3. Change the language to Swedish
  4. Observe that the content changes to Swedish
  5. Change the language to English
  6. Observe that the content changes to English
  7. Change the language to Finnish
  8. Observe that the content changes to Finnish
- **Expected Result**: The cookie management content is displayed in the selected language

### Cookie Preference Management
- **Test Title**: Toggle cookie preferences  
- **Description**: Verify that users can toggle statistics cookies (Matomo) on and off  
- **Test Steps**:
  1. Navigate to the Cookie Management page
  2. Locate the statistics cookie toggle (Matomo)
  3. If currently enabled, disable the statistics cookie
  4. Save preferences
  5. Verify the setting is saved (cookie is updated)
  6. Enable the statistics cookie
  7. Save preferences
  8. Verify the setting is saved (cookie is updated)
- **Expected Result**: Cookie preferences are successfully saved and persisted in the browser

### Cookie Information Display
- **Test Title**: View cookie policy information  
- **Description**: Verify that users can access detailed information about cookies  
- **Test Steps**:
  1. Navigate to the Cookie Management page
  2. Observe the content sections for different cookie categories
  3. Verify that essential cookies information is available
  4. Verify that statistics cookies (Matomo) information is available
- **Expected Result**: Comprehensive information about different cookie types is displayed

## Test Coverage
- Direct URL navigation to Cookie Management page
- Language switching functionality
- Cookie preference toggling
- Cookie information display
- Settings persistence

## Prerequisites
- The application must have `config.enableCookies` set to true
- For Cookiebot specific tests (if applicable): `config.enableCookiebot` must be true
- Browser with cookies enabled
- Clean browser state (no existing cookies) for some tests 