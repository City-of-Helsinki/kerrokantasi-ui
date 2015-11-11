import {readFileSync} from 'fs';
import {Provider} from 'nconf';
const _ = require('lodash');

const defaults = {
  serverUrl: 'http://localhost:8086',
  publicUrl: null,
  helsinkiAuthId: null,
  helsinkiAuthSecret: null,
  helsinkiTargetApp: 'kerrokantasi',
  jwtAudience: 'kerrokantasi',
  jwtKey: null,
  sessionSecret: null,
  dev: false,
  cold: false
};


export default function getOptions() {
  const nconf = new Provider();
  nconf.argv(); // Args are good
  nconf.env(); // Envs are good
  nconf.file({file: './kk.config'}); // Config is good
  nconf.defaults(_.clone(defaults));  // Defaults are good
  const settings = _.pick(nconf.get(), Object.keys(defaults));
  const {hostname, port} = require('url').parse(settings.serverUrl);
  settings.hostname = hostname;
  settings.port = port;
  settings.publicUrl = settings.publicUrl || settings.serverUrl;
  if (settings.dev) {
    if(!settings.sessionSecret) {
      settings.sessionSecret = 'Don\'t Panic.';
    }
    if(!settings.jwtKey) {
      settings.jwtKey = 'kerrokantasi';
    }
  }
  return settings;
}
