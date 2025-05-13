# Hearing Fields

This document lists all the fields that can be submitted when creating a new hearing in the Kerrokantasi system.

## 1. Basic Information (Step 1)

- `title`: Multilingual object with translations for each language (required, max 200 characters)
- `slug`: URL slug for the hearing (required)
- `labels`: Array of label IDs (required, at least one)
- `contact_persons`: Array of contact person IDs (required, at least one)
- `organization`: Organization string

## 2. Sections (Step 2)

- `sections`: Array of section objects, each containing:
  - `type`: Section type (e.g., main, part, etc.)
  - `title`: Multilingual object for section title
  - `abstract`: Multilingual object for section abstract
  - `content`: Multilingual object for section content
  - `voting`: Settings for voting (default: 'registered')
  - `commenting`: Settings for commenting (default: 'open')
  - `commenting_map_tools`: Settings for map tools (default: 'none')
  - `images`: Array of image objects
  - `files`: Array of file attachments
  - `questions`: Array of question objects (for polls/surveys), each containing:
    - `type`: Question type
    - `text`: Multilingual object for question text
    - `options`: Array of option objects for answers

## 3. Map Information (Step 3)

- `geojson`: GeoJSON data for map visualization

## 4. Timing Settings (Step 4)

- `open_at`: Date when the hearing opens (required)
- `close_at`: Date when the hearing closes (required)
- `published`: Boolean indicating if the hearing is published

## 5. Project Information (Step 5, optional)

- `project`: Project object containing:
  - `id`: Project ID
  - `title`: Multilingual object for project title
  - `phases`: Array of project phase objects, each containing:
    - `title`: Multilingual object for phase title
    - `is_active`: Boolean indicating if the phase is active

## Additional Settings

- `default_to_fullscreen`: Boolean for full-screen display setting

Note: Each multilingual field (`title`, `abstract`, `content`, etc.) contains translations for the languages selected in the hearing languages section (e.g., `fi`, `sv`, `en`). 


