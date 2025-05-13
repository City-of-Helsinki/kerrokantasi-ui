# User Profile Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Profile Loading](#profile-loading)
  - [Favorite Hearings](#favorite-hearings)
  - [User Comments](#user-comments)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)
- [Revision History](#revision-history)

## Overview
The User Profile page allows authenticated users to view and manage their personal information, favorite hearings, and comments they've made across the platform. This page provides a centralized location for users to track their engagement with hearings.

## Page Analysis
- **URL**: `/user-profile`
- **Description**: A user-specific page that displays favorite hearings and all comments made by the user
- **Key Functionalities**:
  1. View favorite/followed hearings with ability to unfavorite
  2. View all comments made by the user across various hearings
  3. Filter comments by specific hearing
  4. Sort comments by different criteria (newest/oldest)
  5. Display comment details including hearing status, publication date, and content

## Test Cases
### Profile Loading
- **Test Title**: Verify user profile page loads correctly for authenticated users
- **Description**: Ensures that the user profile page loads with the correct content when accessed by an authenticated user  
- **Test Steps**:
  1. Navigate to the application homepage
  2. Log in with valid user credentials
  3. Navigate to the user profile page via the header link or directly to /user-profile
- **Expected Result**: The user profile page loads with sections for favorite hearings and user comments

- **Test Title**: Verify unauthenticated users are redirected from profile page
- **Description**: Ensures that unauthenticated users cannot access the user profile page  
- **Test Steps**:
  1. Clear any existing authentication/session
  2. Try to navigate directly to the /user-profile URL
- **Expected Result**: User is redirected to login page or shown appropriate error message

### Favorite Hearings
- **Test Title**: Verify favorite hearings are displayed correctly
- **Description**: Ensures that all hearings marked as favorites appear in the user profile page  
- **Test Steps**:
  1. Log in with a user that has at least one favorite hearing
  2. Navigate to the user profile page
- **Expected Result**: All favorite hearings are displayed as cards with correct titles and status

- **Test Title**: Verify removing a hearing from favorites
- **Description**: Tests the ability to unfavorite a hearing from the profile page  
- **Test Steps**:
  1. Log in with a user that has at least one favorite hearing
  2. Navigate to the user profile page
  3. Click the unfavorite/remove button on a hearing card
- **Expected Result**: The hearing is removed from the favorites list without page refresh

- **Test Title**: Verify empty state for favorite hearings
- **Description**: Tests the display when a user has no favorite hearings  
- **Test Steps**:
  1. Log in with a user that has no favorite hearings
  2. Navigate to the user profile page
- **Expected Result**: A message indicating no favorite hearings is displayed

### User Comments
- **Test Title**: Verify all user comments are displayed
- **Description**: Ensures that all comments made by the user across different hearings are visible  
- **Test Steps**:
  1. Log in with a user who has made multiple comments
  2. Navigate to the user profile page
- **Expected Result**: All user comments are displayed with correct content, timestamps, and hearing information

- **Test Title**: Verify filtering comments by hearing
- **Description**: Tests the dropdown filter to show comments from a specific hearing  
- **Test Steps**:
  1. Log in with a user who has commented on multiple hearings
  2. Navigate to the user profile page
  3. Use the hearing select dropdown
  4. Select a specific hearing from the list
- **Expected Result**: Only comments from the selected hearing are displayed

- **Test Title**: Verify comment sorting functionality
- **Description**: Tests the ability to sort comments by newest or oldest first  
- **Test Steps**:
  1. Log in with a user who has multiple comments
  2. Navigate to the user profile page
  3. Use the comment order select dropdown
  4. Select "Oldest first" option
- **Expected Result**: Comments are reordered with oldest comments appearing first

- **Test Title**: Verify empty state for user comments
- **Description**: Tests the display when a user has not made any comments  
- **Test Steps**:
  1. Log in with a user who has not made any comments
  2. Navigate to the user profile page
- **Expected Result**: A message indicating no comments have been made is displayed

- **Test Title**: Verify comment content display
- **Description**: Ensures that comment content, images, and maps are properly displayed  
- **Test Steps**:
  1. Log in with a user who has made comments containing text, images, and map data
  2. Navigate to the user profile page
  3. For comments with maps, click the "Show map" button
- **Expected Result**: Comment content, images and maps are displayed correctly

## Test Coverage
- Authentication handling: 15%
- Favorite hearings display and management: 35%
- User comments display and filtering: 40%
- UI elements and accessibility: 10%

## Prerequisites
1. Multiple test user accounts with various states:
   - Users with favorite hearings
   - Users without favorite hearings
   - Users with comments on multiple hearings
   - Users with no comments
2. Test hearings with various states (open/closed)
3. Test comments with various content types (text, images, map data)
