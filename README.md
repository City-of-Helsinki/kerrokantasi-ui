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

### Other commands for development

* `yarn run dev`: development mode (hot reloading and all that jazz, also broken)
* `yarn run test`: run tests

Bundle size analysis is available (by way of the `webpack-bundle-analyzer` plugin) if the `BUNDLE_ANALYZER` environment variable is set.
