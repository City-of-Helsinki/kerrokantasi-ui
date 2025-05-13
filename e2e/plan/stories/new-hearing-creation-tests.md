# New Hearing Creation Test Plan
## Table of Contents
- [Overview](#overview)
- [Page Analysis](#page-analysis)
- [Test Cases](#test-cases)
  - [Authentication](#authentication)
  - [Form Step 1: Basic Information](#form-step-1-basic-information)
  - [Form Step 2: Sections](#form-step-2-sections)
  - [Form Step 3: Map](#form-step-3-map)
  - [Form Step 4: Time Settings](#form-step-4-time-settings)
  - [Form Step 5: Project Settings](#form-step-5-project-settings)
  - [Form Validation and Submission](#form-validation-and-submission)
- [Test Coverage](#test-coverage)
- [Prerequisites](#prerequisites)
- [Revision History](#revision-history)

## Overview
The New Hearing Creation page allows authorized users to create new hearings. This is a multi-step form where administrators can define hearing details including basic information, sections, map configuration, scheduling, and project settings. Testing this feature is critical to ensure administrators can properly create and publish hearings.

## Page Analysis
- **URL**: `/hearing/new`
- **Description**: A multi-step form for creating a new hearing
- **Key Functionalities**:
  1. Authentication check (admin access only)
  2. Multi-language hearing creation
  3. Step 1: Basic information (title, slug, labels, contact persons, etc.)
  4. Step 2: Section management (adding/editing content sections)
  5. Step 3: Map configuration (location settings)
  6. Step 4: Time settings (opening and closing dates)
  7. Step 5: Project configuration
  8. Form validation
  9. Draft saving
  10. Preview functionality

## Test Cases
### Authentication
- **Test Title**: Verify authentication requirement for hearing creation  
- **Description**: Ensure only authenticated administrators can access the hearing creation page  
- **Test Steps**:
  1. Navigate to `/hearing/new` as an unauthenticated user
  2. Verify login prompt is displayed
  3. Click the login button
  4. Authenticate as a non-admin user
  5. Navigate to `/hearing/new`
  6. Verify appropriate error or redirect occurs
  7. Log out
  8. Authenticate as an admin user
  9. Navigate to `/hearing/new`
  10. Verify the hearing creation form is displayed
- **Expected Result**: Only authenticated admin users can access the hearing creation form. Non-admin users receive an appropriate error or redirect.

### Form Step 1: Basic Information
- **Test Title**: Complete basic information fields in Step 1  
- **Description**: Verify all fields in Step 1 can be properly filled and validated  
- **Test Steps**:
  1. Navigate to `/hearing/new` as an admin user
  2. Select languages for the hearing (e.g., Finnish, Swedish, English)
  3. Enter title in all selected languages
  4. Enter a slug in the URL field
  5. Add labels to the hearing
  6. Select organization
  7. Add contact persons
  8. Enter lead paragraph text in all selected languages
  9. Verify "Next" button works correctly
- **Expected Result**: All fields can be filled correctly, and the form advances to Step 2 when "Next" is clicked.

- **Test Title**: Verify language selection functionality  
- **Description**: Ensure language selection controls work correctly  
- **Test Steps**:
  1. Navigate to `/hearing/new` as an admin user
  2. Add multiple languages (e.g., Finnish, Swedish, English)
  3. Verify language-specific fields appear for all selected languages
  4. Remove a language
  5. Verify fields for removed language disappear
- **Expected Result**: Language selection controls work correctly, showing/hiding fields as languages are added/removed.

- **Test Title**: Test contact person management  
- **Description**: Verify adding and selecting contact persons works correctly  
- **Test Steps**:
  1. Navigate to `/hearing/new` as an admin user
  2. Click to add a new contact person
  3. Fill in contact details (name, title, phone, email, organization)
  4. Save the contact
  5. Verify contact appears in the list of available contacts
  6. Select the contact for the hearing
- **Expected Result**: New contacts can be added and selected for the hearing.

### Form Step 2: Sections
- **Test Title**: Add and configure hearing sections  
- **Description**: Verify that sections can be added and configured correctly  
- **Test Steps**:
  1. Navigate to Step 2 of the hearing creation form
  2. Click the "Add Section" button
  3. Enter section title in all selected languages
  4. Enter section content using the rich text editor
  5. Add an image to the section
  6. Add section attachments
  7. Configure commenting and voting options
  8. Add poll questions if applicable
  9. Verify sections can be reordered using up/down buttons
  10. Add another section and configure it
- **Expected Result**: Sections can be added, configured with all options, and reordered correctly.

### Form Step 3: Map
- **Test Title**: Configure map settings  
- **Description**: Verify map functionality for the hearing  
- **Test Steps**:
  1. Navigate to Step 3 of the hearing creation form
  2. Enable map for the hearing
  3. Add map markers by clicking on the map
  4. Edit marker details
  5. Delete a marker
  6. Upload a GeoJSON file
  7. Verify the uploaded data appears correctly
- **Expected Result**: Map functionality works correctly, allowing markers to be added, edited, and deleted, and GeoJSON data to be uploaded.

### Form Step 4: Time Settings
- **Test Title**: Configure hearing time settings  
- **Description**: Verify opening and closing dates/times can be set correctly  
- **Test Steps**:
  1. Navigate to Step 4 of the hearing creation form
  2. Set opening date using the date picker
  3. Set opening time
  4. Set closing date using the date picker
  5. Set closing time
  6. Configure closure information text in all selected languages
  7. Click "Next" to proceed
- **Expected Result**: Opening and closing dates/times can be set correctly, and closure information can be configured.

### Form Step 5: Project Settings
- **Test Title**: Configure project settings  
- **Description**: Verify project selection and phase configuration  
- **Test Steps**:
  1. Navigate to Step 5 of the hearing creation form
  2. Select an existing project from the dropdown
  3. Verify project details are loaded
  4. Modify project settings if needed
  5. Add/edit project phases
- **Expected Result**: Project settings can be configured correctly.

### Form Validation and Submission
- **Test Title**: Test form validation and submission  
- **Description**: Verify validation rules work and hearing can be successfully saved  
- **Test Steps**:
  1. Navigate to `/hearing/new` as an admin user
  2. Fill in all required fields in all steps
  3. Intentionally leave some required fields empty
  4. Attempt to save the hearing
  5. Verify appropriate validation errors are displayed
  6. Complete all required fields
  7. Click "Save and Preview"
  8. Verify the preview appears correctly
  9. Make additional changes
  10. Click "Save Changes"
  11. Verify the hearing is saved as a draft
- **Expected Result**: Form validation works correctly, showing errors for missing fields. Hearing can be saved as a draft and previewed.

## Test Coverage
The test plan covers all critical functionality of the hearing creation process:
- Authentication and authorization
- Multi-language support
- All form steps (basic info, sections, map, time settings, project settings)
- Form validation
- Draft saving and preview

## Prerequisites
1. Admin user account credentials
2. Non-admin user account credentials
3. Test GeoJSON file for map testing
4. Test images for section attachments
5. Access to existing projects in the system
