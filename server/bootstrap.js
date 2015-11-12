import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import historyApiFallback from 'connect-history-api-fallback';
import getSettings from './getSettings';
import {getCompiler, applyCompilerMiddleware} from './bundler';
import {getPassport, addAuth} from './auth';
import {inspect} from 'util';
import morgan from 'morgan';
import renderMiddleware from "./render-middleware";

const args = require('minimist')(process.argv.slice(2));

const settings = getSettings();
if (settings.dev || args.dump) {
  console.log("Settings:\n", inspect(settings, {colors: true}));
}
const server = express();
const compiler = getCompiler(settings, true);
const passport = getPassport(settings);

server.use('/', express.static(compiler.options.paths.OUTPUT));
server.use('/assets', express.static(compiler.options.paths.ASSETS));
server.use(morgan(settings.dev ? 'dev' : 'combined'));
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true}));
server.use(cookieSession({secret: settings.sessionSecret, cookie: {maxAge: 60 * 60000}}));
server.use(passport.initialize());
server.use(passport.session());
addAuth(server, passport, settings);

if (settings.dev) {
  applyCompilerMiddleware(server, compiler, settings);
}
server.use(renderMiddleware(settings));


function run() {
  // Hello? Anyone there?
  server.listen(settings.port, settings.hostname, () => {
    console.log(`[***] Listening on ${settings.hostname}:${settings.port}.`);
  });
}

compiler.run((err, stats) => {
  if (err) throw new Error(`Webpack error: ${err}`);
  console.log(stats.toString({assets: true, chunkModules: false, chunks: true, colors: true}));
});
run();
