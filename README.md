Kerrokantasi UI
===============

[![Build Status](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui.svg?branch=master)](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui)
[![codecov](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui)

Kerrokantasi UI is the user interface powering kerrokantasi.hel.fi service. It
is a full featured interface for both answering and creating questionnaires as
supported by Kerrokantasi API.

## Development installation

### Prerequisites

* Node v8 LTS
* Yarn

### Configuration

config_dev.json contains partially working settings giving you read only access
to our test API. If you have your own API and/or authentication credentials you
can change the relevant settings therein. See section "Available settings".

Using your own authentication server requires code changes in server/auth.js.

### Running development server

```
yarn start
```
No separate build step is currently available.

### Other commands for development

* `yarn run dev`: development mode (hot reloading and all that jazz, also broken)
* `yarn run test`: run tests

Bundle size analysis is available (by way of the `webpack-bundle-analyzer` plugin) if the `BUNDLE_ANALYZER` environment variable is set.

## Available settings

* `serverUrl`: The URL an port to bind the server to; defaults to `localhost:8086`
* `publicUrl`: The public URL of the server; defaults to `serverUrl` if not set
* `helsinkiAuthId`: The OAuth2 app ID for Helsinki Auth -- **required in production**
* `helsinkiAuthSecret`: The OAuth2 app secret for Helsinki Auth -- **required in production**
* `helsinkiTargetApp`: The "target app" entry for Helsinki Auth
* `jwtKey`: The key to use for the backend communication JWT auth token -- **required in production**
* `sessionSecret`: The secret used for signing the session cookie -- **required in production**
* `dev`: Set this to enter development mode (on by default)
* `cold`: Set this to not use hot reloading in dev mode
* `uiConfig`: Object that will be passed on to the UI code. The following keys inside are used:
    *`piwikUrl`: URL of the piwik php used for link tracking.
    *`sentryDns`: URL for reporting exceptions to sentry.
