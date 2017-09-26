/* eslint-disable no-console */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import getSettings from '../conf/getSettings';
import {getPassport, addAuth} from './auth';
import {inspect} from 'util';
import morgan from 'morgan';
import paths from '../conf/paths';

function ignition() {
  const args = require('minimist')(process.argv.slice(2));

  const settings = getSettings();
  if (settings.dev || args.dump) {
    console.log("Settings:\n", inspect(settings, {colors: true}));
  }
  const server = express();
  const passport = getPassport(settings);

  server.use('/', express.static(paths.OUTPUT));
  server.use('/assets', express.static(paths.ASSETS));
  server.use(morgan(settings.dev ? 'dev' : 'combined'));
  server.use(cookieParser());
  server.use(bodyParser.urlencoded({extended: true}));
  server.use((req, res, next) => {
    if (/127\.0\.0\.1/.test(req.hostname)) {
      res.status(400).send("Please use localhost, not 127.0.0.1.");
    } else {
      next();
    }
  });
  server.use(cookieSession({name: 's', secret: settings.sessionSecret, maxAge: 86400 * 1000}));
  server.use(passport.initialize());
  server.use(passport.session());
  addAuth(server, passport, settings);

  server.listen(settings.port, settings.hostname, () => {
    console.log(`[***] Listening on ${settings.hostname}:${settings.port}.`);
  });
}

export default ignition;
