# Hearings Listing Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Hearings List View](#hearings-list-view)
  - [Hearings Map View](#hearings-map-view)
  - [Hearings Filter and Search](#hearings-filter-and-search)
  - [Admin Features](#admin-features)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)
- [Revision History](#revision-history)

## Overview
The Hearings Listing page allows users to browse, search, and filter all hearings in the system, with different views including a list and map view. It provides comprehensive filtering options and special administrative features for admin users.

## Page Analysis
- **URL**: `/hearings/:tab` (where tab can be "list" or "map")
- **Description**: A page that displays all hearings with filtering and search capabilities
- **Key Functionalities**:
  1. Browsing hearings in list format
  2. Browsing hearings in map format
  3. Searching hearings by title
  4. Filtering hearings by labels
  5. Filtering to show only open hearings
  6. Sorting hearings
  7. Infinite scrolling to load more hearings
  8. Admin-specific filtering options
  9. Admin-specific creation of new hearings

## Test Cases
### Hearings List View
- **Test Title**: Verify list view displays hearings correctly  
- **Description**: Ensure the list view shows hearings with correct information  
- **Test Steps**:
  1. Navigate to `/hearings/list`
  2. Observe the hearings list
  3. Verify each hearing item shows title, comment count, open/close dates, and labels
  4. Verify closed hearings have a "Closed" tag
  5. Click on a hearing title
  - **Expected Result**: Hearings are displayed in list format with all required information, and clicking a hearing navigates to its detail page

- **Test Title**: Test infinite scroll functionality  
- **Description**: Verify more hearings load when scrolling to the bottom of the page  
- **Test Steps**:
  1. Navigate to `/hearings/list`
  2. Scroll to the bottom of the page
  3. Verify loading spinner appears
  4. Verify more hearings are loaded after the spinner disappears
  - **Expected Result**: Additional hearings load when reaching the bottom of the page

### Hearings Map View
- **Test Title**: Verify map view displays hearings correctly  
- **Description**: Ensure the map view shows hearing locations properly  
- **Test Steps**:
  1. Navigate to `/hearings/map`
  2. Verify the map loads with markers for hearings
  3. Click on a map marker
  4. Verify popup shows hearing information
  - **Expected Result**: Map displays with markers for hearings, and clicking a marker shows a popup with hearing details

- **Test Title**: Test "Show only open" checkbox in map view  
- **Description**: Verify "Show only open" checkbox filters map markers  
- **Test Steps**:
  1. Navigate to `/hearings/map`
  2. Observe initial map markers
  3. Click "Show only open" checkbox
  4. Verify map markers are updated to show only open hearings
  - **Expected Result**: When checkbox is checked, only markers for open hearings are displayed

### Hearings Filter and Search
- **Test Title**: Test title search functionality  
- **Description**: Verify search by title works correctly  
- **Test Steps**:
  1. Navigate to `/hearings/list`
  2. Enter a search term in the search input
  3. Press the search button
  4. Verify URL updates with search parameter
  5. Verify hearings list updates to show only matching results
  - **Expected Result**: Hearings list updates to show only hearings matching the search term

- **Test Title**: Test label filtering  
- **Description**: Verify filtering by labels works correctly  
- **Test Steps**:
  1. Navigate to `/hearings/list`
  2. Select one or more labels from the label dropdown
  3. Verify URL updates with label parameters
  4. Verify hearings list updates to show only hearings with selected labels
  - **Expected Result**: Hearings list updates to show only hearings with selected labels

- **Test Title**: Test "Show only open" toggle functionality in list view  
- **Description**: Verify filtering to show only open hearings works correctly  
- **Test Steps**:
  1. Navigate to `/hearings/list`
  2. Click the "Show only open" filter option
  3. Verify hearings list updates to show only open hearings
  - **Expected Result**: Only open hearings are displayed when filter is applied

- **Test Title**: Test combined filters (search, labels, open status)  
- **Description**: Verify multiple filters work correctly together  
- **Test Steps**:
  1. Navigate to `/hearings/list`
  2. Enter a search term
  3. Select one or more labels
  4. Enable "Show only open" filter
  5. Verify hearings list updates correctly with all filters applied
  - **Expected Result**: Hearings list displays only hearings matching all filter criteria

### Admin Features
- **Test Title**: Verify admin filter selector visibility  
- **Description**: Ensure admin filter options are only visible to admin users  
- **Test Steps**:
  1. Navigate to `/hearings/list` as a regular user
  2. Verify admin filter selector is not visible
  3. Log in as an admin user
  4. Navigate to `/hearings/list`
  5. Verify admin filter selector is visible
  - **Expected Result**: Admin filter selector is only visible when logged in as admin

- **Test Title**: Test admin filter functionality  
- **Description**: Verify admin filters work correctly  
- **Test Steps**:
  1. Log in as an admin user
  2. Navigate to `/hearings/list`
  3. Select different admin filter options (Published, Queue, Drafts)
  4. Verify hearings list updates according to selected filter
  - **Expected Result**: Hearings list displays hearings matching the selected admin filter

- **Test Title**: Verify "Create Hearing" button functionality  
- **Description**: Ensure "Create Hearing" button is visible to admins and works correctly  
- **Test Steps**:
  1. Log in as an admin user
  2. Navigate to `/hearings/list`
  3. Verify "Create Hearing" button is visible
  4. Click "Create Hearing" button
  5. Verify navigation to new hearing creation page
  - **Expected Result**: Button is visible to admins and clicking it navigates to hearing creation page

## Test Coverage
- **Core Functionality**: 80%
  - List view rendering and navigation
  - Map view rendering and interaction
  - Search and filtering
  - Tab switching between list and map
  - Infinite scrolling

- **Admin Functionality**: 90%
  - Admin filters
  - Create hearing button
  - Special admin-only views

- **Edge Cases**: 70%
  - Empty results handling
  - Loading states
  - Error states

## Prerequisites
- Test user accounts:
  - Regular user account
  - Admin user account
- Test data:
  - Multiple hearings with various statuses (open, closed)
  - Hearings with different labels
  - Hearings with and without geographical coordinates for map testing
