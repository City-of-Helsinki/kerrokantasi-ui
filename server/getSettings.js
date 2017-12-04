import {Provider} from 'nconf';

const _ = require('lodash');

const defaults = {
  // Server will listen on this address and port
  listen_address: 'localhost',
  listen_port: '8086',
  // URL for the Kerrokantasi API endpoint
  api_base: 'http://localhost:8000',
  // URL this frontend runs at, for callbacks
  publicUrl: 'http://localhost:8080',
  // Client Identifier in the Helsinki SSO system
  helsinkiAuthId: null,
  // Shared secret in the Helsinki SSO system
  helsinkiAuthSecret: null,
  // We'll request access to the API identified by this
  helsinkiTargetApp: null,
  // cookie signing secret (among other things) for ExpressJS
  sessionSecret: null,
  // only used to pass Sentry DSN as JSON structure
  uiConfig: null,
  // this sets dev stuff, can be overridden from environment 'dev'
  dev: process.env.NODE_ENV !== 'production',
  // disables hot reloading middleware
  cold: false,
};

const optionalKeys = ["listen_address", "listen_port", "api_base", "publicUrl", "uiConfig", "dev", "cold"];
const mandatoryKeys = ["helsinkiAuthId", "helsinkiAuthSecret", "helsinkiTargetApp", "sessionSecret"];

export default function getOptions() {
  const nconf = new Provider();

  nconf.env(optionalKeys.concat(mandatoryKeys));
  if (defaults.dev) {
    // Note that 'file' will read in any keys whatsoever
    nconf.file('config_dev.json');
  } else {
    // We want somewhere to store uiConfig
    nconf.use('memory');
  }
  nconf.defaults(defaults);

  nconf.required(mandatoryKeys);

  const uiConfig = nconf.get('uiConfig');
  if (_.isString(uiConfig)) {
    nconf.set('uiConfig', JSON.parse(uiConfig));
  }

  if (nconf.get('serverRendering')) {
    throw new Error("Server rendering is not currently supported.");
  }

  console.log(nconf.get());
  return nconf.get();
}
