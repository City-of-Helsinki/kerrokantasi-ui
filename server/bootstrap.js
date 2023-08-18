/* eslint-disable no-console */
import {inspect} from 'util';
import path from 'path';
import fs from 'fs';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import morgan from 'morgan';

import getSettings from './getSettings';
import {getCompiler, applyCompilerMiddleware} from './bundler';
import renderMiddleware from "./render-middleware";
import paths from '../conf/paths';
import assetPaths from '../conf/assetPaths';


function ignition() {
  const settings = getSettings();

  if (settings.dev) {
    console.log("Settings:\n", inspect(settings, {colors: true}));
  }
  const server = express();

  const faviconPath = path.resolve(assetPaths.cityAssets, 'favicon');

  server.use('/', express.static(paths.OUTPUT));
  server.use('/assets', express.static(paths.ASSETS));
  server.use('/favicon', express.static(faviconPath));
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
  server.use(cookieSession({name: 's', secret: settings.expressjs_session_secret, maxAge: 86400 * 1000}));

  if (settings.dev) {
    const compiler = getCompiler(settings, true);
    applyCompilerMiddleware(server, compiler, settings);
  }
  server.use(renderMiddleware(settings));

  function run() {
    // Hello? Anyone there?
    server.listen(settings.listen_port, settings.listen_address, () => {
      console.log(`[***] Listening on ${settings.listen_address}:${settings.listen_port}.`);
    });
  }

  if (settings.dev) {
    run();
  } else {
    fs.readFile(
      // Read bundle entrypoint from a known location
      path.resolve(paths.OUTPUT, "bundle_src.txt"), "utf-8",
      (err, data) => {
        if (err) {
          throw err;
        }
        settings.bundleSrc = data;
        run();
      });
  }
}

export default ignition;
