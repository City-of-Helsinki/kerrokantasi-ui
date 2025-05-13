# User Hearings Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Authentication and Access](#authentication-and-access)
  - [Viewing Hearings](#viewing-hearings)
  - [Filtering and Sorting](#filtering-and-sorting)
  - [Navigation and Actions](#navigation-and-actions)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)

## Overview
The User Hearings page allows authenticated users to view, manage, and filter hearings they've created or that belong to their organization. This feature provides administrative capabilities for users with appropriate permissions to track hearings in different states.

## Page Analysis
- **URL**: `/user-hearings`
- **Description**: Dashboard for users to view and manage hearings they've created or that belong to their organization
- **Key Functionalities**:
  1. View hearings in different states (draft, queued, open, closed)
  2. Toggle between personal hearings and organization hearings
  3. Sort hearings by various criteria
  4. Create new hearings
  5. View hearing details through hearing cards

## Test Cases
### Authentication and Access
- **Test Title**: Verify access control for unauthorized users  
- **Description**: Ensure unauthorized users cannot access the user hearings page  
- **Test Steps**:
  1. Attempt to navigate to `/user-hearings` as an unauthenticated user
  - **Expected Result**: User should be redirected to login page or shown an access denied message

- **Test Title**: Verify access for authorized users  
- **Description**: Ensure users with appropriate permissions can access the page  
- **Test Steps**:
  1. Log in as a user with hearing management permissions
  2. Navigate to `/user-hearings`
  - **Expected Result**: User should see the User Hearings dashboard with their hearings

### Viewing Hearings
- **Test Title**: Verify all hearing sections are displayed correctly  
- **Description**: Ensure all hearing sections (draft, queue, open, closed) are displayed  
- **Test Steps**:
  1. Log in as a user with existing hearings in different states
  2. Navigate to `/user-hearings`
  - **Expected Result**: Page should display separate sections for draft, queued, open, and closed hearings with correct counts

- **Test Title**: Verify empty state handling  
- **Description**: Ensure appropriate messages are shown when no hearings exist  
- **Test Steps**:
  1. Log in as a user with no hearings
  2. Navigate to `/user-hearings`
  - **Expected Result**: Each section should display "No hearings" message with search icon

- **Test Title**: Verify hearing cards display correctly  
- **Description**: Ensure hearing cards show correct information  
- **Test Steps**:
  1. Log in as a user with hearings
  2. Navigate to `/user-hearings`
  3. Inspect hearing cards in each section
  - **Expected Result**: Each card should display hearing title, status, date information, and other relevant details

- **Test Title**: Verify "Show All" functionality  
- **Description**: Ensure "Show All" button loads additional hearings  
- **Test Steps**:
  1. Log in as a user with more than 4 hearings in a section
  2. Navigate to `/user-hearings`
  3. Click "Show All" button in a section with more than 4 hearings
  - **Expected Result**: Additional hearings should be loaded and displayed

### Filtering and Sorting
- **Test Title**: Verify toggle between personal and organization hearings  
- **Description**: Ensure users can switch between personal and organization hearings  
- **Test Steps**:
  1. Log in as a user with organization permissions
  2. Navigate to `/user-hearings`
  3. Open tools dropdown by clicking the gear icon
  4. Select "Organization Hearings" radio button
  - **Expected Result**: Displayed hearings should update to show organization hearings
  5. Select "Own Hearings" radio button
  - **Expected Result**: Displayed hearings should update to show only personal hearings

- **Test Title**: Verify sorting functionality  
- **Description**: Ensure hearings can be sorted by various criteria  
- **Test Steps**:
  1. Log in as a user with multiple hearings
  2. Navigate to `/user-hearings`
  3. Open tools dropdown by clicking the gear icon
  4. Select different sorting options from the dropdown (Newest First, Oldest First, etc.)
  - **Expected Result**: Hearings should reorder according to selected sorting option

### Navigation and Actions
- **Test Title**: Verify hearing creation navigation  
- **Description**: Ensure "Create Hearing" button navigates to hearing creation page  
- **Test Steps**:
  1. Log in as a user with hearing creation permissions
  2. Navigate to `/user-hearings`
  3. Click "Create Hearing" button
  - **Expected Result**: User should be navigated to `/hearing/new`

- **Test Title**: Verify hearing card navigation  
- **Description**: Ensure clicking on a hearing card navigates to the hearing details page  
- **Test Steps**:
  1. Log in as a user with hearings
  2. Navigate to `/user-hearings`
  3. Click on a hearing card
  - **Expected Result**: User should be navigated to the selected hearing's detail page

## Test Coverage
- Authentication and access control: 15%
- Viewing hearings in different states: 30%
- Filtering and sorting functionality: 25%
- Navigation and action verification: 20%
- Edge cases and error handling: 10%

## Prerequisites
- Test user accounts with various permission levels:
  - User with no hearings
  - User with hearings in all states (draft, queue, open, closed)
  - User with organization admin permissions
- Test data:
  - Multiple hearings in different states
  - At least 5 hearings in one section to test "Show All" functionality 