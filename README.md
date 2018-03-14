Kerrokantasi UI
===============

[![Build Status](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui.svg?branch=master)](https://travis-ci.org/City-of-Helsinki/kerrokantasi-ui)
[![codecov](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/kerrokantasi-ui)

Kerrokantasi UI is the user interface powering kerrokantasi.hel.fi service. It
is a full featured interface for both answering and creating questionnaires as
supported by Kerrokantasi API.

## Installation

### Prerequisites

* Node v8 LTS
* Yarn

### Configuration

`config_dev.toml` is used for configuration when NODE_ENV != "production". It
is in TOML-format, which for our purposes is `Key=Value` format.

When NODE_ENV=="production", only environment variables are used for
configuration. This is done because we've had several painful accidents
with leftover configuration files. The environment variables are named
identically to the ones used in config_dev.toml. Do note that the variables
are case insensitive, ie. `KeRRokanTasi_aPi_bASe` is a valid name. Go wild!

In the repository root there is `config_dev.toml.example` which contains
every setting and comments explaining their use. If you only want to give
kerrokantasi-ui a test, all configuration you need to do is:
`mv config_dev.toml.example to config_dev.toml`
That will give you a partially working configuration for browsing test
questionnaires in our test API.

### Running development server

```
yarn start
```
No separate build step is currently available. There is a development server
though. It is somewhat unstable, but provides hot reloading:
```
yarn run dev
```

The server will output the URL for accessing kerrokantasi-ui.

### Running in production

Kerrokantasi-ui always builds itself on start. Therefore, be prepared
for a lenghty start-up time. You can use your favorite
process manager to run `yarn start`. Node-specific managers
can also directly run `server(/index.js)`.

### Other commands

* `yarn run fetch-plugins`: fetch optional plugins (see below)
* `yarn run test`: run tests

### Plugins

Questionnaires can make use of plugins. As of yet, their use case
has been to provide map based questionnaries. Examples include having
citizens indicate places for amenities and polling the public for
locations of city bike stations.

A default set of plugins can be installed using `yarn run fetch-plugins`.
The plugins are installed in `assets/plugins`. By default, kerrokantasi-ui
expects to find them in `assets/plugins` URL prefix. The development server
serves that path, but you can also use a web server of your choice for this.

It is also possible to change the paths that kerrokantasi-ui will search for
specific plugins. See `src/shared_config.json`, which is the configuration
source for both the plugin fetcher script and the UI itself. After
changing the paths therein, you can run the plugin fetcher and it will
place the plugins to those directories.
