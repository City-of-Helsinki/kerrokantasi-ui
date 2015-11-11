const _ = require('lodash');

const defaultSettings = {
  serverUrl: 'http://127.0.0.1:8086',
  dev: false,
  cold: false
};

/**
 * Get server options from args and env.
 *
 * @param args Something `minimist` can parse; defaults to the process argv
 * @param env A dictionary of environment variables; defaults to the process env
 */
export default function getOptions(args = null, env = null) {
  args = args || require('minimist')(process.argv.slice(2));
  env = env || process.env;
  const settings = _.assign({}, defaultSettings);
  for (var setting in settings) {
    if (!settings.hasOwnProperty(setting)) {
      continue;
    }
    _.each([
      setting,
      _.snakeCase(setting).toUpperCase(),  // "serverUrl" -> "SERVER_URL"
      _.kebabCase(setting).toLowerCase()  // "serverUrl" -> "server-url"
    ], function (arg) {
      if (env[arg]) settings[setting] = env[arg];
      if (args[arg]) settings[setting] = args[arg];
    });
  }
  const {hostname, port} = require('url').parse(settings.serverUrl);
  settings.hostname = hostname;
  settings.port = port;
  return settings;
}
