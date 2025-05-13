# Section View Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Navigation](#navigation)
  - [Content Display](#content-display)
  - [Attachments](#attachments)
  - [Comments](#comments)
  - [Plugins](#plugins)
  - [User Actions](#user-actions)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)
- [Revision History](#revision-history)

## Overview
The Section View page displays a specific section within a hearing, allowing users to view section content, related files, and participate through comments and interactions. This is a core feature of the platform enabling users to focus on specific parts of a hearing.

## Page Analysis
- **URL**: `/:hearingSlug/:sectionId` (includes dynamic segments for hearing and section identifiers)
- **Description**: Displays a specific section of a hearing with its content, comments, and related media
- **Key Functionalities**:
  1. Displaying section content (title, abstract, body text)
  2. Showing section images and media
  3. Viewing and downloading section attachments
  4. Reading and posting comments specific to the section
  5. Voting on comments
  6. Navigating between different sections of the hearing
  7. Handling plugin content for specialized section types
  8. Flagging inappropriate comments
  9. Downloading section reports (for administrators)

## Test Cases
### Navigation
- **Test Title**: Navigate to specific section via direct URL  
- **Description**: Verify that a user can access a specific section by entering its URL directly  
- **Test Steps**:
  1. Navigate to `/:hearingSlug/:sectionId` with valid identifiers
  2. Wait for the page to load completely
- **Expected Result**: The specific section page loads with the correct content displayed

- **Test Title**: Navigate between sections using section browser  
- **Description**: Verify that a user can navigate between hearing sections using the section browser  
- **Test Steps**:
  1. Navigate to a section page
  2. Locate the section browser component
  3. Click on a different section link
  4. Verify the URL changes and new section content loads
- **Expected Result**: User is redirected to the selected section with its content displayed correctly

- **Test Title**: Use previous/next navigation controls  
- **Description**: Verify that users can navigate sequentially through sections  
- **Test Steps**:
  1. Navigate to a section in a hearing with multiple sections
  2. Locate the previous/next navigation buttons
  3. Click the "next" button
  4. Verify navigation to the next section
  5. Click the "previous" button
  6. Verify navigation to the previous section
- **Expected Result**: Sequential navigation works correctly with proper section loading

### Content Display
- **Test Title**: Verify section content display  
- **Description**: Check that section content is properly displayed  
- **Test Steps**:
  1. Navigate to a section page
  2. Verify the section title is displayed
  3. Check that the section abstract (if available) is displayed
  4. Verify that the main content is displayed
  5. Check that formatting, links, and embedded content render correctly
- **Expected Result**: All section content displays correctly with proper formatting

- **Test Title**: Section image display and lightbox  
- **Description**: Verify that section images display correctly and can be viewed in lightbox  
- **Test Steps**:
  1. Navigate to a section with images
  2. Verify images are displayed with correct dimensions
  3. Click on an image
  4. Verify lightbox opens with the full-size image
  5. Close the lightbox
  6. Verify return to normal section view
- **Expected Result**: Images display correctly and lightbox functionality works as expected

- **Test Title**: Verify section details collapsible behavior  
- **Description**: Check that section details can be expanded and collapsed  
- **Test Steps**:
  1. Navigate to a section page
  2. Verify if section details are initially expanded or collapsed according to screen size
  3. Click on the toggle button for section details
  4. Verify the section expands/collapses appropriately
- **Expected Result**: Section detail areas expand and collapse correctly

### Attachments
- **Test Title**: View and download section attachments  
- **Description**: Verify that users can view and download files attached to a section  
- **Test Steps**:
  1. Navigate to a section with attachments
  2. Locate the attachments section
  3. If collapsed, expand the attachments section
  4. Verify list of attachments is displayed with appropriate icons
  5. Click on an attachment
  6. Verify the file download starts
- **Expected Result**: Attachments are properly listed and can be downloaded

- **Test Title**: Verify attachment metadata display  
- **Description**: Check that attachment metadata (file type, size, name) is correctly displayed  
- **Test Steps**:
  1. Navigate to a section with attachments
  2. Expand the attachments section
  3. Verify each attachment shows:
     - File name
     - File type indicator/icon
     - File size (if available)
- **Expected Result**: All attachment metadata is correctly displayed

### Comments
- **Test Title**: View section-specific comments  
- **Description**: Verify that comments specific to the current section are displayed  
- **Test Steps**:
  1. Navigate to a section with existing comments
  2. Scroll to the comments section
  3. Verify comments are displayed with:
     - Author information
     - Timestamp
     - Comment content
     - Vote count
- **Expected Result**: Section-specific comments are displayed correctly

- **Test Title**: Sort section comments  
- **Description**: Verify that users can sort section comments using different criteria  
- **Test Steps**:
  1. Navigate to a section with multiple comments
  2. Locate the comment sort dropdown
  3. Select different sorting options (newest, oldest, most voted)
  4. Verify comments reorder according to the selected criteria
- **Expected Result**: Comments are properly sorted according to selected criteria

- **Test Title**: Post new comment on a section  
- **Description**: Verify authenticated users can post comments on a specific section  
- **Test Steps**:
  1. Log in as a registered user
  2. Navigate to a section page
  3. Scroll to the comment form
  4. Enter text in the comment field
  5. Submit the comment
  6. Verify the comment appears in the comment list
- **Expected Result**: New comment is successfully posted and displayed

- **Test Title**: Reply to existing comment  
- **Description**: Verify users can reply to existing comments on a section  
- **Test Steps**:
  1. Navigate to a section with existing comments
  2. Locate a comment to reply to
  3. Click the reply button
  4. Enter reply text
  5. Submit the reply
  6. Verify the reply appears nested under the original comment
- **Expected Result**: Reply is successfully posted and displayed in the correct hierarchy

- **Test Title**: Vote on section comment  
- **Description**: Verify users can vote on comments if voting is enabled  
- **Test Steps**:
  1. Navigate to a section with votable comments
  2. Locate a comment to vote on
  3. Click the vote button
  4. If not logged in and required, complete the login process
  5. Verify the vote count increases
- **Expected Result**: Vote is registered and count updates accordingly

- **Test Title**: Flag inappropriate comment  
- **Description**: Verify admin users can flag inappropriate comments  
- **Test Steps**:
  1. Log in as an administrative user
  2. Navigate to a section with comments
  3. Locate a comment to flag
  4. Click the flag button
  5. Confirm the flagging action
- **Expected Result**: Comment is flagged successfully

### Plugins
- **Test Title**: Render plugin-specific content  
- **Description**: Verify that sections with plugin identifiers render specialized content correctly  
- **Test Steps**:
  1. Navigate to a section with a plugin (e.g., MapQuestionnaire)
  2. Verify the plugin content loads
  3. Check that plugin-specific UI elements are displayed
  4. Interact with the plugin interface
- **Expected Result**: Plugin content renders and functions correctly

### User Actions
- **Test Title**: Download section report (for administrators)  
- **Description**: Verify that administrative users can download section reports  
- **Test Steps**:
  1. Log in as an administrative user
  2. Navigate to a section page
  3. Locate the download report button
  4. Click the download button
  5. Verify the report download starts
- **Expected Result**: Report downloads successfully in the expected format

- **Test Title**: Edit comment (for comment author)  
- **Description**: Verify that users can edit their own comments  
- **Test Steps**:
  1. Log in as a user who has previously commented
  2. Navigate to a section with your comment
  3. Locate your comment
  4. Click the edit button
  5. Modify the comment text
  6. Save the changes
  7. Verify the comment updates with edited content
- **Expected Result**: Comment is successfully edited and updated

- **Test Title**: Delete comment (for comment author or admin)  
- **Description**: Verify that users can delete their own comments  
- **Test Steps**:
  1. Log in as a user who has previously commented or as an admin
  2. Navigate to a section with the target comment
  3. Locate the comment
  4. Click the delete button
  5. Confirm deletion in modal dialog
  6. Verify the comment is removed from the list
- **Expected Result**: Comment is successfully deleted and removed from display

## Test Coverage
This test plan covers the core functionalities of the section view page including:
- Navigation between sections (15%)
- Content display including text and images (20%)
- Attachment handling (10%)
- Comment viewing and interaction (25%)
- Plugin content (10%)
- Administrative functions (10%)

Potential gaps in coverage include:
- Testing with all possible plugin types
- Performance testing with large numbers of comments
- Edge cases for different section configurations
- Accessibility testing for all interactive elements

## Prerequisites
1. A test environment with hearings containing multiple section types:
   - Standard text sections with images
   - Sections with file attachments
   - Sections with plugin content
2. Test user accounts with different permission levels:
   - Anonymous (not logged in)
   - Regular authenticated user
   - Administrative user
3. Pre-existing comments on test sections for testing interactions
4. Playwright setup capable of:
   - Handling file downloads
   - Managing authentication state
