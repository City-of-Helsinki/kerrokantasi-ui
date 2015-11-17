Kerro Kantasi UI
================

[![Build Status](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui.svg)](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui) [![Coverage Status](https://coveralls.io/repos/City-of-Helsinki/kerrokantasi-ui/badge.svg?branch=master&service=github)](https://coveralls.io/github/City-of-Helsinki/kerrokantasi-ui?branch=master)


Requirements
------------

* Node.js 4.2 LTS
* Bower

Preparation
-----------

```
npm i
bower i
```

Scripts
-------

* `npm run dev`: development mode (hot reloading and all that jazz)
* `npm start`: production mode

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
* `dev`: Set this to enter development mode
* `serverRendering`: Whether server (isomorphic) rendering should be on. This is implicitly passed by `npm start`.
* `cold`: Set this to not use hot reloading in dev mode

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
