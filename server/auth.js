import {Passport} from 'passport';
import HelsinkiStrategy from 'passport-helsinki';
import jwt from 'jsonwebtoken';
import merge from 'lodash/object/merge';

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

MockStrategy.prototype.authenticate = function (req, options) {
  const profile = {
    id: '5ca1ab1e-cafe-babe-beef-deadbea70000',
    displayName: 'Mock von User',
    firstName: 'Mock',
    lastName: 'von User',
    username: 'mock.von.user',
    provider: 'helsinki'
  };
  profile.token = generateToken(profile, this.options);
  this.success(profile);
};


export function getPassport(settings) {
  const jwtOptions = {key: settings.jwtKey, audience: 'kerrokantasi'};
  const passport = new Passport();
  const helsinkiStrategy = new HelsinkiStrategy({
      clientID: settings.helsinkiAuthId,
      clientSecret: settings.helsinkiAuthSecret,
      callbackURL: settings.publicUrl + '/login/helsinki/return'
    },
    function (accessToken, refreshToken, profile, done) {
      //helsinkiStrategy.getAPIToken(accessToken, settings.helsinkiTargetApp, (token) => {
      //  profile.token = token;
      //});
      if (profile._json) delete profile._json;
      if (profile._raw) delete profile._raw;
      profile.token = generateToken(profile, jwtOptions);
      return done(null, profile);
    }
  );
  passport.use(helsinkiStrategy);
  if (settings.dev) {
    passport.use(new MockStrategy(jwtOptions));
  }
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  return passport;
}

function successfulLoginHandler(req, res) {
  const js = 'if(window.opener) { window.close(); } else { location.href = "/"; }';
  res.send('<html><body>Login successful.<script>' + js + '</script>');
}

export function addAuth(server, passport, settings) {
  server.use(passport.initialize());
  server.use(passport.session());
  server.get('/login/helsinki', passport.authenticate('helsinki'));
  if (settings.dev) {
    server.get('/login/mock', passport.authenticate('mock'), successfulLoginHandler);
  }
  server.get('/login/helsinki/return', passport.authenticate('helsinki'), successfulLoginHandler);
  server.get('/logout', (req, res) => {
    res.send('<html><body><form method="post"></form><script>document.forms[0].submit()</script>');
  });
  server.post('/logout', (req, res) => {
    req.logout();
    res.send('OK');
  });
  server.get('/me', (req, res) => {
    console.log(req.user);
    res.json(req.user || {});
  });
}
