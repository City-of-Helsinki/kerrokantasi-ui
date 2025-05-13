# Fullscreen Hearing Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Navigation](#navigation)
  - [Map Interaction](#map-interaction)
  - [Commenting](#commenting)
  - [Responsiveness](#responsiveness)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)
- [Revision History](#revision-history)

## Overview
The Fullscreen Hearing view provides a maximized, immersive map-based experience for users to view and interact with hearing content. This feature allows citizens to focus entirely on the map plugin, facilitating better spatial understanding and interaction with the hearing's map-based content.

## Page Analysis
- **URL**: `/:hearingSlug/fullscreen` (where `:hearingSlug` is the unique identifier of a hearing)
- **Description**: An immersive fullscreen view focused on the primary map plugin of a hearing, with a minimal navigation header.
- **Key Functionalities**:
  1. Displaying the hearing's map content in fullscreen mode
  2. Allowing commenting directly on the map
  3. Viewing existing comments on the map
  4. Voting on comments
  5. Navigating between fullscreen and regular hearing view
  6. Returning to the homepage

## Test Cases
### Navigation
- **Test Title**: Verify navigation to fullscreen view  
- **Description**: Tests that users can access the fullscreen view from the regular hearing view  
- **Test Steps**:
  1. Navigate to a hearing detail page that has a map plugin (`/:hearingSlug`)
  2. Look for and click on the fullscreen/expand button
  3. Verify URL changes to `/:hearingSlug/fullscreen`
  4. Verify the fullscreen view is displayed
- **Expected Result**: The hearing's map content is displayed in fullscreen mode with a minimal header

- **Test Title**: Verify exit from fullscreen view  
- **Description**: Tests that users can return to the regular hearing view  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view (`/:hearingSlug/fullscreen`)
  2. Click on the minimize/compress button in the top-right corner
  3. Verify URL changes to `/:hearingSlug`
  4. Verify the standard hearing view is displayed
- **Expected Result**: The user is returned to the regular hearing view with all standard components visible

- **Test Title**: Verify home navigation from fullscreen view  
- **Description**: Tests that users can navigate to the homepage from the fullscreen view  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view (`/:hearingSlug/fullscreen`)
  2. Click on the logo in the top-left corner
  3. Verify URL changes to the homepage (`/`)
  4. Verify the homepage is loaded
- **Expected Result**: The user is navigated to the homepage

- **Test Title**: Verify automatic redirection to fullscreen for hearings with default_to_fullscreen setting  
- **Description**: Tests that hearings with default_to_fullscreen=true automatically redirect to fullscreen view  
- **Test Steps**:
  1. Navigate to a hearing that has default_to_fullscreen set to true (`/:hearingSlug`)
  2. Observe the automatic redirection
  3. Verify URL changes to `/:hearingSlug/fullscreen`
  4. Verify the fullscreen view is displayed
- **Expected Result**: The user is automatically redirected to the fullscreen view

### Map Interaction
- **Test Title**: Verify map display and controls  
- **Description**: Tests that the map is properly displayed with all controls functional  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view
  2. Verify the map is visible and fills the available space
  3. Test zoom in/out controls
  4. Test map panning by dragging
  5. Verify any map layers or overlays are correctly displayed
- **Expected Result**: The map is fully functional with all expected controls working properly

- **Test Title**: Verify map markers/features display  
- **Description**: Tests that all map features (markers, polygons, etc.) are correctly displayed  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view with existing map content
  2. Verify all markers, polygons, or other map features are visible
  3. Hover over or click on a marker to see its tooltip or popup
  4. Verify the information in the popup is correct
- **Expected Result**: All map features are correctly displayed and interactive

### Commenting
- **Test Title**: Submit a comment on the map  
- **Description**: Tests ability to create a location-based comment on the map  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view
  2. Click on the map to place a marker (or use the drawing tools if available)
  3. Enter comment text in the comment form
  4. Submit the comment
  5. Verify the comment appears on the map
- **Expected Result**: The comment is successfully posted and displayed on the map

- **Test Title**: View existing comments on the map  
- **Description**: Tests the visibility and interaction with existing map comments  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view with existing comments
  2. Locate comment markers on the map
  3. Click on a comment marker
  4. Verify the comment text and details are displayed
- **Expected Result**: Existing comments are visible and can be viewed by clicking on their markers

- **Test Title**: Vote on a map comment  
- **Description**: Tests the ability to vote on comments in the fullscreen view  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view with existing comments
  2. Click on a comment marker to view the comment
  3. Click the vote/like button on the comment
  4. Verify the vote count increases
- **Expected Result**: The user can successfully vote on comments in the fullscreen view

### Responsiveness
- **Test Title**: Verify fullscreen view responsiveness on different screen sizes  
- **Description**: Tests that the fullscreen view adapts correctly to different screen sizes  
- **Test Steps**:
  1. Navigate to a fullscreen hearing view
  2. Resize the browser window to different dimensions (mobile, tablet, desktop)
  3. Verify that the layout adapts properly
  4. Verify that all functionality remains accessible
- **Expected Result**: The fullscreen view is responsive and fully functional across different screen sizes

## Test Coverage
- Navigation between regular and fullscreen views: 100%
- Map display and interaction: 80%
- Map-based commenting functionality: 90%
- Comment viewing and voting: 90%
- Responsive design testing: 70%

## Prerequisites
- A test hearing with map plugin enabled and configured
- A hearing with default_to_fullscreen=true for redirection testing
- Sample GeoJSON data for map display
- Existing comments on the map for testing interaction
- User accounts with different permission levels (anonymous, registered, admin)
