# Kerrokantasi UI

Kerrokantasi UI is the user interface powering kerrokantasi.hel.fi service. It
is a full featured interface for both answering and creating questionnaires as
supported by Kerrokantasi API.

## Installation

### Prerequisites

- Node v18 LTS (`nvm use`)
- Yarn
- Docker

### Configuration

`.env` is the preliminary configuration file. To use local configuration, create `.env.local` which will override other configuration (see `.env.local.example`).

### Running development server

```
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You will also see any lint errors in the console.

https://vitejs.dev/guide/cli.html#vite

Scripts generates first environment variables to `public/env-config.js` with `scripts/update-runtime-env.js`, which contains the
actual used variables when running the app. App is not using default `process.env` way to refer of variables but
`window._env_` object.

### Other commands
```yarn build```

Builds the app for production to the `build` folder.<br />
It correctly bundles app in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [build](https://vitejs.dev/guide/cli.html#build) for more information.

Note that running built application locally you need to generate also `public/env-config.js` file. It can be done with
`yarn update-runtime-env`. By default it's generated for development environment if no `NODE_ENV` is set.

```yarn run test```

See the section about [running tests](https://vitest.dev/guide/) for more information.

Scripts generates first environment variables to `public/test-env-config.js` with `scripts/update-runtime-env.js`, which contains the
actual used variables when running the app. App is not using default `process.env` way to refer of variables but
`window._env_` object.

```yarn test:e2e```

Runs end-to-end tests using [Playwright](https://playwright.dev).

It is recommended to run these tests to ensure the overall functionality and user experience of the application.

```yarn update-runtime-env```

Generates variable object used when app is running. Generated object is stored at `public/env-config.js` and available
as `window._env_` object.

Generation uses values from either
[environment variables or files](https://vitejs.dev/guide/env-and-mode.html).

At the production deployment same generation is done with [`env.sh`](scripts/env.sh).

### Running service in Docker

#### How to build a docker image

```bash
docker compose build
```

#### How to run the docker image

```bash
docker compose up
```

The web application is running at http://localhost:8086

## Commit message format

New commit messages must adhere to the [Conventional Commits](https://www.conventionalcommits.org/)
specification, and line length is limited to 72 characters.

[commitlint](https://github.com/conventional-changelog/commitlint) checks every new commit for the correct format.

### Using local Tunnistamo instance for development with docker

#### Set tunnistamo hostname

Add the following line to your hosts file (`/etc/hosts` on mac and linux):

    127.0.0.1 tunnistamo-backend

#### Create a new OAuth app on GitHub

Go to https://github.com/settings/developers/ and add a new app with the following settings:

- Application name: can be anything, e.g. local tunnistamo
- Homepage URL: http://tunnistamo-backend:8000
- Authorization callback URL: http://tunnistamo-backend:8000/accounts/github/login/callback/

Save. You'll need the created **Client ID** and **Client Secret** for configuring tunnistamo in the next step.

#### Install local tunnistamo

Clone https://github.com/City-of-Helsinki/tunnistamo/.

Follow the instructions for setting up tunnistamo locally. Before running `docker compose up` set the following settings in tunnistamo roots `docker-compose.env.yaml`:

- SOCIAL_AUTH_GITHUB_KEY: **Client ID** from the GitHub OAuth app
- SOCIAL_AUTH_GITHUB_SECRET: **Client Secret** from the GitHub OAuth app

After you've got tunnistamo running locally, ssh to the tunnistamo docker container:

`docker compose exec django bash`

and execute the following four commands inside your docker container:

```bash
./manage.py add_oidc_client -n kerrokantasi-ui -t "id_token token" -u "http://localhost:8086/callback" "http://localhost:8086/silent-renew" -i https://api.hel.fi/auth/kerrokantasi-ui -m github -s dev
./manage.py add_oidc_client -n kerrokantasi-api -t "code" -u http://localhost:8080/complete/tunnistamo/ -i https://api.hel.fi/auth/kerrokantasi -m github -s dev -c
./manage.py add_oidc_api -n kerrokantasi -d https://api.hel.fi/auth -s email,profile -c https://api.hel.fi/auth/kerrokantasi
./manage.py add_oidc_api_scope -an kerrokantasi -c https://api.hel.fi/auth/kerrokantasi -n "Kerrokantasi" -d "Lorem ipsum"
./manage.py add_oidc_client_to_api_scope -asi https://api.hel.fi/auth/kerrokantasi -c https://api.hel.fi/auth/kerrokantasi-ui
```

#### Configure Tunnistamo to frontend

Change the following configuration in `.env.local`

```
kerrokantasi_api_base="http://localhost:8080"

openid_client_id="https://api.hel.fi/auth/kerrokantasi-ui"
openid_audience="https://api.hel.fi/auth/kerrokantasi"
openid_authority="http://tunnistamo-backend:8000"
openid_apitoken_url="http://tunnistamo-backend:8000/api-tokens/"
openid_scope="openid profile https://api.hel.fi/auth/kerrokantasi"
```

#### Configure Helsinki Profiili to frontend

Change the following configuration in `.env.local`

```
kerrokantasi_api_base="http://localhost:8080"

openid_client_id="kerrokantasi-ui-dev"
openid_audience="kerrokantasi-api-dev"
openid_authority="https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus"
openid_apitoken_url="https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/token"
openid_scope="openid profile email"
```

#### Install Kerrokantasi API locally

Clone the repository (https://github.com/City-of-Helsinki/kerrokantasi). Follow the instructions for running kerrokantasi with docker and using local Tunnistamo.

### Plugins

Questionnaires can make use of plugins. As of yet, their use case
has been to provide map based questionnaries. Examples include having
citizens indicate places for amenities and polling the public for
locations of city bike stations.

A default set of plugins can be installed using `yarn run fetch-plugins`.
The plugins are installed in `assets/plugins`. By default, kerrokantasi-ui
expects to find them in `assets/plugins` URL prefix. The development server
serves that path, but you can also use a web server of your choice for this.
For server insllations, the plugin fetcher supports downloading the plugins
to a directory specified on the command line (`yarn run fetch-plugins /srv/my-kerrokantasi-plugins`).

It is also possible to change the paths that kerrokantasi-ui will search for
specific plugins. See `src/shared_config.json`, which is the configuration
source for both the plugin fetcher script and the UI itself. After
changing the paths therein, you can run the plugin fetcher and it will
place the plugins to those directories. Note that specifying path on the
command line overrides the path specified in shared_config.json.

## Writing of CSS

**Important:**
Kerrokantasi default UI styles are meant to be generic styles (a.k.a whitelabel
styles). This means that no city specific variables or colors should be used
in the `assets/sass/` folder. This project supports theming and if there's
a need to style components differently to match a certain city's branding,
theme styles will be used to override any default styles.

The styles are based on Bootstrap version 3 (Sass).

## Using the whitelabel theme assets

To have a non city specific theme, change the `REACT_APP_CITY_CONFIG` config value to `whitelabel`

## Installing city specific assets

Currently the process of using the theme is not super developer friendly as it does
not support the use of `yarn link`. This means that to do development on the project
it will have to be installed in the kerrokantasi-ui project and then edited within
the kerrokantasi-ui `node_modules/<theme_assets>` folder. If someone can find
a solution to this, please fix.

**Development steps:**

1. Place the theme assets folder next to the `kerrokantasi-ui` folder
   - The structure should look like this:
     ```
     /
       /kerrokantasi-ui
       /<theme-assets-folder>
     ```
2. In the `kerrokantasi-ui` project run `yarn add ../<theme-assets-folder>`
3. Edit files in `kerrokantasi-ui/node_modules/<theme-assets-folder>` for changes to be reflected
4. Set the `REACT_APP_CITY_CONFIG` config to `<theme-assets-folder>`

**Production installation:**

1. Add the project to the local `kerrokantasi-ui` project either by installing it
   the same way as in the dev environment, or from GitHub or if the package is published
   to npm, then install it from there.
2. Set the `REACT_APP_CITY_CONFIG` config to `<theme-assets-folder>`

## Creating city specific assets

The assets of a city currently consists of the following things:

1. Styling
2. Favicons
3. Images
4. Translation strings
5. Service URLs and external URLs

An example of how a theme assets project could look like, either check out the `cities/helsinki`
folder in this project, or have a look already created theme assets such as:

https://github.com/City-of-Turku/kerrokantasi-ui-turku

### Styles

How to apply your theme CSS:

Create a file `assets/app.scss` and apply style imports accordingly:

```
// This needs to be imported before kerrokantasi variables
@import "my-custom-variables.scss";

// Import the required kerrokantasi styles
@import "~kerrokantasi-ui/assets/sass/kerrokantasi/variables.scss";
@import "~kerrokantasi-ui/assets/sass/kerrokantasi/bootstrap.scss";
@import "~kerrokantasi-ui/assets/sass/kerrokantasi/kerrokantasi.scss";

// These are imported after the kerrokantasi styles to apply overrides
@import "my-custom-styles-and-overrides.scss";
```

### Aliases

The following aliases are available to use in SCSS and JS files:

- `kerrokantasi-ui`: Points to the root of this project
- `kerrokantasi-ui-modules`: Points to the node_modules of this project
- `@city-config`: Points to the root of the city specific assets
- `@city-assets`: Points to the assets folder in the city specific assets
- `@city-i18n`: Point to the i18n folder in the city specific assets
- `@@city-images`: Point to the image folder in the city specific assets

### Naming conventions

The following naming conventions needs to be used in order to city assets to
work.

- `/assets/app.scss`: The base style file that is imported
- `/i18n/[fi, sv, en].json`: Language files. If no string changes are to be made, only include `{}` in the files
- `/i18n/localization.json`: Other configuration related to localization. Currently holds map default position
- `/i18n/service-info/content.[fi, sv, en].md`: Service info page texts, if no file found service will display
  information that content was not found.
- `/assets/images/logo[fi, sv]-black.svg`: Black/Dark site logo
- `/assets/images/logo[fi, sv]-white.svg`: White/Light site logo
- `/assets/urls.json`: Configure where links point to, also holds path to analytics script. If analytics path is
  false analytics is disabled.

#### Favicons:

The following favicons are recommended, but not mandatory to include.

- `/assets/favicon/favicon.ico`
- `/assets/favicon/favicon-32x32.png`
- `/assets/favicon/favicon-16x16.png`
- `/assets/favicon/manifest.json`
- `/assets/favicon/safari-pinned-tab.svg`
- `/assets/favicon/browserconfig.xml`

If no favicon is provided the UI will use the default kerrokantasi favicon.
