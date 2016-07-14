/* eslint-disable no-param-reassign */

import {Passport} from 'passport';
import HelsinkiStrategy from 'passport-helsinki';
import jwt from 'jsonwebtoken';
import merge from 'lodash/merge';
import _debug from 'debug';
const debug = _debug('auth');

function generateToken(profile, options) {
  return jwt.sign(merge({}, profile), options.key, {
    subject: profile.id,
    audience: options.audience
  });
}

function MockStrategy(options) {
  this.name = 'mock';
  this.options = options;
}

MockStrategy.prototype.authenticate = function mockAuthenticate() {
  const profile = {
    id: '5ca1ab1e-cafe-babe-beef-deadbea70000',
    displayName: 'Mock von User',
    firstName: 'Mock',
    lastName: 'von User',
    username: 'mock.von.user',
    provider: 'helsinki'
  };
  profile.token = generateToken(profile, this.options);
  debug('mock strategy success:', profile);
  this.success(profile);
};


export function getPassport(settings) {
  const getTokenFromAPI = true;
  const jwtOptions = {key: settings.jwtKey, audience: 'kerrokantasi'};
  const passport = new Passport();
  const helsinkiStrategy = new HelsinkiStrategy({
    clientID: settings.helsinkiAuthId,
    clientSecret: settings.helsinkiAuthSecret,
    callbackURL: settings.publicUrl + '/login/helsinki/return'
  }, (accessToken, refreshToken, profile, done) => {
    debug('access token:', accessToken);
    debug('refresh token:', refreshToken);
    if (getTokenFromAPI) {
      debug('acquiring token from api...');
      helsinkiStrategy.getAPIToken(accessToken, settings.helsinkiTargetApp, (token) => {
        profile.token = token;
        return done(null, profile);
      });
    } else {
      if (profile._json) delete profile._json;
      if (profile._raw) delete profile._raw;
      profile.token = generateToken(profile, jwtOptions);
      debug('token generated with options:', jwtOptions);
      debug('profile:', profile);
      done(null, profile);
    }
  });
  passport.use(helsinkiStrategy);
  if (settings.dev && false) { // preferably develop using SSO
    passport.use(new MockStrategy(jwtOptions));
  }
  passport.serializeUser((user, done) => {
    debug('serializing user:', user);
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    debug('deserializing user:', user);
    done(null, user);
  });
  return passport;
}

function successfulLoginHandler(req, res) {
  const js = 'setTimeout(function() {if(window.opener) { window.close(); } else { location.href = "/"; } }, 300);';
  res.send('<html><body>Login successful.<script>' + js + '</script>');
}

export function addAuth(server, passport, settings) {
  server.use(passport.initialize());
  server.use(passport.session());
  server.get('/login/helsinki', passport.authenticate('helsinki'));
  if (settings.dev && false) {  // preferably develop using SSO
    server.get('/login/mock', passport.authenticate('mock'), successfulLoginHandler);
  }
  server.get('/login/helsinki/return', passport.authenticate('helsinki'), successfulLoginHandler);
  server.get('/logout', (req, res) => {
    res.send('<html><body><form method="post"></form><script>document.forms[0].submit()</script>');
  });
  server.post('/logout', (req, res) => {
    req.logout();
    const redirectUrl = req.query.next || '/';
    res.redirect(`https://api.hel.fi/sso/logout/?next=${redirectUrl}`);
  });
  server.get('/me', (req, res) => {
    res.json(req.user || {});
  });
}
