Kerro Kantasi UI
================

[![Build Status](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui.svg?branch=master)](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui)
[![codecov](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui)


Requirements
------------

* Node.js 4.x LTS
* Yarn
* IE11+/Chrome/Firefox/Safari

Preparation
-----------

```
yarn
```

Development
-----------

```
yarn start  # start the authentication server
yarn dev    # start webpack-dev-server for the frontend
            # (proxies to the authentication server)
            # ... add `--hot` for hot reloading
            # ... add `--open` to automagically open a browser  
yarn lint   # lint all the things
yarn test   # run tests
```

Production
----------

```
yarn build  # build an optimized webpack bundle under dist/
yarn start  # start the authentication server (it will serve dist/ and assets/ too as static files)
```

Configuration
-------------

We're using [nconf](https://github.com/indexzero/nconf) for configuration.
You can thus use a configuration file, environment variables and command-
line arguments to configure the frontend.

The known configuration variables are as follows:

* `serverUrl`: The URL to bind the server to; defaults to `localhost:8086`
* `publicUrl`: The public URL of the server; defaults to `serverUrl` if not set
* `helsinkiAuthId`: The OAuth2 app ID for Helsinki Auth -- **required in production**
* `helsinkiAuthSecret`: The OAuth2 app secret for Helsinki Auth -- **required in production**
* `helsinkiTargetApp`: The "target app" entry for Helsinki Auth
* `jwtAudience`: The audience to set for the JWT auth token for backend communication
* `jwtKey`: The key to use for the backend communication JWT auth token -- **required in production**
* `sessionSecret`: The secret used for signing the session cookie -- **required in production**
* `uiConfig`: Object that will be passed on to the UI code. The following keys inside are used:
    *`piwikUrl`: URL of the piwik php used for link tracking.
     
The canonical JSON configuration file is `kk.config` in the cwd. It might
look something like this:

```json
{
  "helsinkiAuthId": "myid",
  "helsinkiAuthSecret": "mysecret",
  "sessionSecret": "anothersecret",
  "jwtKey": "key"
}
```
