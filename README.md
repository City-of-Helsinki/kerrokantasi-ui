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

`config_dev.toml` is used for configuration when NODE_ENV != "production". It
is in TOML-format, which for our purposes is `Key=Value` format.

When NODE_ENV=="production", only environment variables are used for
configuration. The environment variables are named identically to the
ones used in config_dev.toml. Do note that the variables are case
insensitive, ie. `KeRRokanTasi_aPi_bASe` is a valid name. Go wild!

In the repository root there is `config_dev.toml.example` which contains
every setting and comments explaining their use. If you only want to give
kerrokantasi-ui a test, all you need to do is:
`mv config_dev.toml.example to config_dev.toml`
That will give you a partially working configuration for browsing test
questionnaires in our test API.

### Running development server

```
yarn start
```
No separate build step is currently available.

Scripts
-------

* `npm run dev`: development mode (hot reloading and all that jazz)
* `npm run fetch-plugins`
* `npm start`: production mode
* `npm run test`: run tests

Production setup
----------------

Kerrokantasi-ui always builds itself on start. You can use your favorite
process manager to either run `npm start` or server(/index.js)

Questionnaires can make use of plugins. A default set of plugins can be
installed using `npm run fetch-plugins { target_directory }`. By default,
the plugins are installed in `assets/plugins` and served out in
`assets/plugins` URL prefix by kerrokantasi-ui.

If you wish, you can also specify a target directory and serve out that directory
as `assets/plugins` in the same URL space as kerrokantasi-ui. The urls for
plugins are partially hardcoded in kerrokantasi-ui/src/components/PluginContent.js
and partially somewhere else. Maybe returned by the API?

In production, it is the best practice to set configuration variables (see
below) using environment variables.

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
* `uiConfig`: Object that will be passed on to the UI code. The following keys inside are used:
    *`piwikUrl`: URL of the piwik php used for link tracking.
    *`sentryDns`: URL for reporting exceptions to sentry.
     
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
>>>>>>> Document the plugin fetcher and modus operandi in README

Production installation is very similar to a development installation, as
there is no way to create a static build of kerrokantasi-ui currently. Just
specify NODE_ENV=production in the environment to enable any node
optimizations, although they don't really matter. 
