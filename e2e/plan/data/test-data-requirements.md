# Global Test-Data Requirements
## Table of Contents
- [Overview](#overview)
- [User Accounts](#user-accounts)
- [Domain Data](#domain-data)
- [Environment & Feature Flags](#environment--feature-flags)
- [External Services](#external-services)
- [Other Requirements](#other-requirements)

## Overview
This document consolidates all test data and environmental prerequisites referenced by the Playwright test plans in `e2e/plan/stories/`.

## User Accounts
| Requirement | Source Plans |
|----|-----|
| Regular user with no hearings | user-profile-tests.md, user-hearings-tests.md |
| Regular user with favorite hearings | user-profile-tests.md |
| Regular user without favorite hearings | user-profile-tests.md |
| Regular user with comments on multiple hearings | user-profile-tests.md |
| Regular user with no comments | user-profile-tests.md |
| Admin user with hearing management permissions | user-hearings-tests.md, new-hearing-creation-tests.md |
| Organization admin user with permissions to view organization hearings | user-hearings-tests.md |
| User with hearings in all states (draft, queue, open, closed) | hearing-detail-tests.md, user-hearings-tests.md |
| User with rights to download hearing reports | hearing-detail-tests.md |
| User who has previously commented (for edit/delete testing) | section-view-tests.md |

## Domain Data
| Requirement | Source Plans |
|----|-----|
| Multiple hearings in different states (open, closed, draft, queued) | hearings-listing-tests.md, user-hearings-tests.md |
| Hearings with different labels for filtering | hearings-listing-tests.md |
| Hearings with and without geographical coordinates for map testing | hearings-listing-tests.md |
| At least 5 hearings in one section to test "Show All" functionality | user-hearings-tests.md |
| Test hearings with various states (open/closed) and content types | user-profile-tests.md |
| Test comments with various content types (text, images, map data) | user-profile-tests.md |
| A test environment with at least 3 sample hearings in different states | hearing-detail-tests.md |
| Hearing with multiple language translations | hearing-detail-tests.md |
| Hearing with incomplete translations | hearing-detail-tests.md |
| Multiple hearings with votable comments | section-view-tests.md, hearing-detail-tests.md |
| Hearing with multiple sections including standard text, attachments, geographic data, and plugin content | section-view-tests.md |
| Pre-existing comments on test sections for testing interactions | section-view-tests.md |
| Test hearing with map plugin enabled and configured | fullscreen-hearing-tests.md |
| Hearing with default_to_fullscreen=true for redirection testing | fullscreen-hearing-tests.md |
| Sample GeoJSON data for map display | fullscreen-hearing-tests.md, new-hearing-creation-tests.md |
| Existing comments on the map for testing interaction | fullscreen-hearing-tests.md |
| Test GeoJSON file for map testing | new-hearing-creation-tests.md |
| Test images for section attachments | new-hearing-creation-tests.md |
| Access to existing projects in the system | new-hearing-creation-tests.md |

## Environment & Feature Flags
| Requirement | Source Plans |
|----|-----|
| `config.enableCookies` set to true | cookie-management-tests.md |
| `config.enableCookiebot` set to true (for Cookiebot specific tests) | cookie-management-tests.md |

## External Services
| Requirement | Source Plans |
|----|-----|
| Network access to external linked resources | info-page-tests.md, accessibility-page-tests.md |

## Other Requirements
| Requirement | Source Plans |
|----|-----|
| Browser with JavaScript enabled | info-page-tests.md, accessibility-page-tests.md |
| Browser with cookies enabled | cookie-management-tests.md |
| Clean browser state (no existing cookies) for some tests | cookie-management-tests.md |
| Appropriate viewport sizes for testing (desktop, tablet, mobile) | info-page-tests.md, accessibility-page-tests.md |
| Playwright setup capable of handling file downloads | section-view-tests.md |
| Playwright setup capable of testing map interactions | section-view-tests.md |
| Playwright setup capable of managing authentication state | section-view-tests.md, hearing-detail-tests.md |
| Playwright setup capable of mocking geolocation for map testing | hearing-detail-tests.md |
