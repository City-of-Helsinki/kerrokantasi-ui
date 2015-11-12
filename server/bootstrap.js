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

const settings = getSettings();
if(settings.dev) {
  console.log("Settings:\n", inspect(settings, {colors: true}));
}
const server = express();
const compiler = getCompiler(settings);
const passport = getPassport(settings);

server.use('/', express.static(compiler.options.paths.OUTPUT));
server.use(morgan(settings.dev ? 'dev' : 'combined'));
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true}));
server.use(cookieSession({secret: settings.sessionSecret, cookie: {maxAge: 60 * 60000}}));
server.use(passport.initialize());
server.use(passport.session());
addAuth(server, passport, settings);
server.use(historyApiFallback({index: "/", verbose: !!settings.dev}));
applyCompilerMiddleware(server, compiler, settings);

// Hello? Anyone there?
server.listen(settings.port, settings.hostname, () => {
  const msg = `Listening on ${settings.hostname}:${settings.port}.`;
  const banner = new Array(msg.length + 1).join('=');
  console.log(`${banner}\n${msg}\n${banner}`);
});
