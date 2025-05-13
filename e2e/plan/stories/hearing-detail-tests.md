# Hearing Detail Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Navigation](#navigation)
  - [Content Display](#content-display)
  - [Commenting](#commenting)
  - [Maps and Geolocation](#maps-and-geolocation)
  - [Accessibility](#accessibility)
  - [User Interactions](#user-interactions)
  - [Language Options](#language-options)
  - [Social Sharing](#social-sharing)
  - [Favorites](#favorites)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)
- [Revision History](#revision-history)

## Overview
The Hearing Detail page displays a specific hearing's information and allows users to interact with it through commenting, voting, and viewing different sections. This is a core feature of the platform, enabling citizens to participate in open democracy and provide feedback on city initiatives.

## Page Analysis
- **URL**: `/:hearingSlug` (includes dynamic segment for the hearing identifier)
- **Description**: Displays detailed information about a specific hearing with its sections, comments, and metadata
- **Key Functionalities**:
  1. Displaying hearing information (title, abstract, content, timeline)
  2. Showing hearing sections with different content types
  3. Reading and posting comments on sections
  4. Voting on comments
  5. Navigating between different sections of the hearing
  6. Displaying attachments and media related to the hearing
  7. Displaying maps for hearings with geographic data
  8. Adding/removing hearing to/from favorites
  9. Changing language of the hearing
  10. Viewing hearing metadata (open/close dates, comment count)
  11. Social sharing of the hearing
  12. Administrative functions for authorized users

## Test Cases
### Navigation
- **Test Title**: Navigate to hearing page via direct URL  
- **Description**: Verify that a user can access a hearing page by entering its URL directly  
- **Test Steps**:
  1. Navigate to `/:hearingSlug` where hearingSlug is a valid hearing identifier
  2. Wait for the page to load completely
- **Expected Result**: The hearing page loads with the correct hearing data displayed

- **Test Title**: Navigate between hearing sections  
- **Description**: Verify that a user can navigate between different sections of the hearing  
- **Test Steps**:
  1. Navigate to a hearing page with multiple sections
  2. Click on a section link in the section browser
  3. Verify that the selected section content is displayed
  4. Click on next/previous navigation controls
- **Expected Result**: User can navigate between sections and the correct content is displayed for each section

### Content Display
- **Test Title**: Verify hearing information is correctly displayed  
- **Description**: Check that all hearing information is properly displayed on the page  
- **Test Steps**:
  1. Navigate to a hearing page
  2. Check that the following elements are displayed:
     - Hearing title
     - Abstract
     - Timeline information (open and close dates)
     - Labels/tags
     - Main image (if available)
     - Comment count
- **Expected Result**: All hearing information is correctly displayed according to the API data

- **Test Title**: Verify section content is correctly displayed  
- **Description**: Check that section content including text, images, and attachments are properly displayed  
- **Test Steps**:
  1. Navigate to a hearing page
  2. Verify main section content is displayed
  3. Check if images are visible when they exist
  4. Expand attachment section if it exists and verify attachments are listed
  5. Check if maps are displayed for sections with geographic data
- **Expected Result**: All section content is correctly displayed according to the API data

- **Test Title**: Verify hearing metadata visibility  
- **Description**: Check that hearing metadata (timeline, contacts, project info) can be expanded/collapsed  
- **Test Steps**:
  1. Navigate to a hearing page
  2. Click on the toggle for hearing details section
  3. Verify the detail information expands/collapses
  4. Click on the toggle for project information (if available)
  5. Verify project information expands/collapses
  6. Click on the toggle for contact information
  7. Verify contact information expands/collapses
- **Expected Result**: All metadata sections expand and collapse correctly

### Commenting
- **Test Title**: View comments on a section  
- **Description**: Verify that existing comments for a section are displayed correctly  
- **Test Steps**:
  1. Navigate to a hearing page with comments
  2. Scroll to the comments section
  3. Verify that comments are displayed with author, date, and content
  4. Check that comment sorting functions work
- **Expected Result**: Comments are displayed correctly and can be sorted

- **Test Title**: Post a new comment as an anonymous user (if allowed)  
- **Description**: Verify that anonymous commenting works if enabled for the hearing  
- **Test Steps**:
  1. Navigate to a hearing that allows anonymous comments
  2. Scroll to the comment section
  3. Enter text in the comment field
  4. Submit the comment
- **Expected Result**: Comment is submitted successfully and appears in the comment list

- **Test Title**: Post a new comment as an authenticated user  
- **Description**: Verify that authenticated users can post comments  
- **Test Steps**:
  1. Log in as a registered user
  2. Navigate to a hearing page
  3. Scroll to the comment section
  4. Enter text in the comment field
  5. Submit the comment
- **Expected Result**: Comment is submitted successfully and appears in the comment list with the user's name

- **Test Title**: Vote on a comment  
- **Description**: Verify that users can vote on comments if enabled  
- **Test Steps**:
  1. Navigate to a hearing page with comments
  2. Find a comment with voting enabled
  3. Click the vote button
  4. If not logged in and voting requires authentication, verify login prompt appears
  5. After logging in or if already logged in, verify vote count increases
- **Expected Result**: Vote is registered and vote count is updated

- **Test Title**: Flag inappropriate comment  
- **Description**: Verify that users can flag inappropriate comments  
- **Test Steps**:
  1. Navigate to a hearing page with comments
  2. Find a comment to flag
  3. Click the flag button
  4. Confirm the flagging action if prompted
- **Expected Result**: Comment is flagged and confirmation is displayed

### Maps and Geolocation
- **Test Title**: View geographic data on hearing map  
- **Description**: Verify that hearings with geographic data display maps correctly  
- **Test Steps**:
  1. Navigate to a hearing with geographic data
  2. Locate the map component
  3. Verify the map loads correctly
  4. Check that markers or shapes are displayed on the map
- **Expected Result**: Map displays correctly with all geographic elements

- **Test Title**: Interact with map elements  
- **Description**: Verify users can interact with elements on the map  
- **Test Steps**:
  1. Navigate to a hearing with an interactive map
  2. Zoom in/out on the map
  3. Pan around the map
  4. Click on a map marker if present
  5. Verify any popup or information display
- **Expected Result**: Map interactions work correctly

### Accessibility
- **Test Title**: Keyboard navigation through the hearing page  
- **Description**: Verify that users can navigate the hearing page using only keyboard  
- **Test Steps**:
  1. Navigate to a hearing page
  2. Use Tab key to navigate through all interactive elements
  3. Use Enter/Space to activate buttons and links
  4. Use arrow keys to navigate dropdown menus
- **Expected Result**: All interactive elements can be accessed and used via keyboard

- **Test Title**: Screen reader compatibility  
- **Description**: Verify that the hearing page is compatible with screen readers  
- **Test Steps**:
  1. Enable a screen reader
  2. Navigate to a hearing page
  3. Verify that all important content is announced by the screen reader
  4. Check that images have alt text
  5. Verify that form controls have proper labels
- **Expected Result**: All content is accessible to screen reader users

### User Interactions
- **Test Title**: Toggle fullscreen mode  
- **Description**: Verify that users can switch to fullscreen view  
- **Test Steps**:
  1. Navigate to a hearing page
  2. If available, click on the fullscreen button
  3. Verify the page switches to fullscreen view
  4. Click to exit fullscreen
- **Expected Result**: Fullscreen view is toggled correctly

- **Test Title**: Download hearing report (for authorized users)  
- **Description**: Verify that authorized users can download hearing reports  
- **Test Steps**:
  1. Log in as a user with administrative rights for the hearing
  2. Navigate to the hearing page
  3. Locate and click the download report button
- **Expected Result**: Report is downloaded successfully

### Language Options
- **Test Title**: Change hearing language  
- **Description**: Verify that users can change the display language of the hearing  
- **Test Steps**:
  1. Navigate to a hearing with multiple language options
  2. Locate the language selector
  3. Select a different language
  4. Verify that the hearing content is displayed in the selected language
- **Expected Result**: Hearing content is displayed in the selected language

- **Test Title**: View hearing with missing translation  
- **Description**: Verify that appropriate message is shown when translation is missing  
- **Test Steps**:
  1. Navigate to a hearing with incomplete translations
  2. Select a language for which translation is missing
  3. Verify that a message about missing translation is displayed
- **Expected Result**: Appropriate message about missing translation is shown

### Social Sharing
- **Test Title**: Share hearing on social media  
- **Description**: Verify that social sharing functionality works correctly  
- **Test Steps**:
  1. Navigate to a hearing page
  2. Locate social sharing buttons
  3. Click on a social sharing option
  4. Verify that sharing dialog opens with correct hearing information
- **Expected Result**: Social sharing dialogs open with correct hearing URL and metadata

### Favorites
- **Test Title**: Add hearing to favorites as authenticated user  
- **Description**: Verify that authenticated users can add hearings to favorites  
- **Test Steps**:
  1. Log in as a registered user
  2. Navigate to a hearing page
  3. Click the "Add to favorites" button
  4. Verify that the button state changes to indicate the hearing is favorited
- **Expected Result**: Hearing is added to user's favorites and button state updates

- **Test Title**: Remove hearing from favorites  
- **Description**: Verify that users can remove hearings from favorites  
- **Test Steps**:
  1. Log in as a registered user with a favorited hearing
  2. Navigate to the favorited hearing
  3. Click the "Remove from favorites" button
  4. Verify that the button state changes to indicate the hearing is not favorited
- **Expected Result**: Hearing is removed from user's favorites and button state updates

## Test Coverage
The test plan covers the core functionalities of the hearing detail page including:
- Navigation and content display (20%)
- Commenting functionality (25%)
- User interactions like voting and flagging (15%)
- Maps and geolocation features (10%)
- Accessibility features (10%)
- Language options (10%)
- Social sharing (5%)
- Favorites management (5%)

Potential gaps in coverage include:
- Edge cases for different hearing configurations
- Performance testing under heavy load
- Testing all possible plugin integrations
- Complex interaction patterns between multiple users

## Prerequisites
1. A test environment with at least 3 sample hearings in different states:
   - An open hearing with multiple sections and comments
   - A closed hearing
   - A hearing with multiple language translations
2. Test user accounts with different permission levels:
   - Anonymous (not logged in)
   - Regular authenticated user
   - Administrative user with rights to the test hearings
3. A Playwright setup with the ability to:
   - Manage authentication state
   - Mock geolocation for map testing
   - Capture screenshots for visual comparison
