import { isObject, snakeCase } from 'lodash';

// https://github.com/getsentry/sentry-python/blob/8094c9e4462c7af4d73bfe3b6382791f9949e7f0/sentry_sdk/scrubber.py#L14
const DEFAULT_DENYLIST = [
  // stolen from relay
  'password',
  'passwd',
  'secret',
  'api_key',
  'apikey',
  'auth',
  'credentials',
  'mysql_pwd',
  'privatekey',
  'private_key',
  'token',
  'ip_address',
  'session',
  // django
  'csrftoken',
  'sessionid',
  // wsgi
  'remote_addr',
  'x_csrftoken',
  'x_forwarded_for',
  'set_cookie',
  'cookie',
  'authorization',
  'x_api_key',
  'x_forwarded_for',
  'x_real_ip',
  // other common names used in the wild
  'aiohttp_session', // aiohttp
  'connect.sid', // Express
  'csrf_token', // Pyramid
  'csrf', // (this is a cookie name used in accepted answers on stack overflow)
  '_csrf', // Express
  '_csrf_token', // Bottle
  'PHPSESSID', // PHP
  '_session', // Sanic
  'symfony', // Symfony
  'user_session', // Vue
  '_xsrf', // Tornado
  'XSRF-TOKEN' // Angular, Laravel
];

const SENTRY_DENYLIST = [...DEFAULT_DENYLIST, 'additional_info', 'admin_organizations', 'adminOrganizations', 'answered_questions', 'author_name', 'contact_persons', 'contactPersons', 'contacts', 'displayName', 'email', 'external_organization', 'favorite_hearings', 'first_name', 'firstname', 'followed_hearings', 'has_strong_auth', 'hasStrongAuth', 'last_name', 'lastname', 'name', 'nickname', 'oidc', 'oidcUser', 'organization', 'organizations', 'phone', 'profile', 'provider', 'title', 'user', 'username'];

export const cleanSensitiveData = (data) => {
  const dataCopy = data;

  Object.entries(dataCopy).forEach(([key, value]) => {
    if (
      SENTRY_DENYLIST.includes(key) ||
      SENTRY_DENYLIST.includes(snakeCase(key))
    ) {
      delete dataCopy[key];
    } else if (Array.isArray(value)) {
      dataCopy[key] = value.map(item =>
        isObject(item)
          ? cleanSensitiveData(item)
          : item
      );
    } else if (isObject(value)) {
      dataCopy[key] = cleanSensitiveData(value);
    }
  });

  return dataCopy;
};

export const beforeSend = (event) =>
  cleanSensitiveData(
    (event)
  );

export const beforeSendTransaction = (
  event
  // eslint-disable-next-line sonarjs/no-identical-functions
) =>
  cleanSensitiveData(
    (event)
  );
