const Nconf = require('nconf');
const _ = require('lodash');

const defaults = {
  serverUrl: 'http://localhost:8086',
  apiBaseUrl: 'http://localhost:8000',
  publicUrl: null,
  helsinkiAuthId: null,
  helsinkiAuthSecret: null,
  helsinkiTargetApp: 'kerrokantasi',
  jwtAudience: 'kerrokantasi',
  jwtKey: null,
  sessionSecret: null,
  uiConfig: null,
  dev: false,
};

const requiredKeys = ["helsinkiAuthId", "helsinkiAuthSecret", "sessionSecret"];

module.exports = function getOptions() {
  const nconf = new Nconf.Provider();
  nconf.argv(); // Args are good
  nconf.env(); // Envs are good
  nconf.file({file: './kk.config'}); // Config is good
  nconf.defaults(_.clone(defaults));  // Defaults are good
  const settings = _.pick(nconf.get(), Object.keys(defaults));
  if (_.isString(settings.uiConfig)) {
    settings.uiConfig = JSON.parse(settings.uiConfig);
  }
  const {hostname, port} = require('url').parse(settings.serverUrl);
  settings.hostname = hostname;
  settings.port = port;
  settings.publicUrl = settings.publicUrl || settings.serverUrl;
  if (false) {
    if (!settings.sessionSecret) {
      settings.sessionSecret = 'Don\'t Panic.';
    }
    if (!settings.jwtKey) {
      settings.jwtKey = 'kerrokantasi';
    }
  }
  const missingKeys = requiredKeys.filter((key) => !settings[key]);
  if (missingKeys.length) {
    throw new Error("These configuration values are required but are currently missing: " + missingKeys.join(", "));
  }
  if (settings.serverRendering) {
    throw new Error("Server rendering is not currently supported.");
  }
  return settings;
};
