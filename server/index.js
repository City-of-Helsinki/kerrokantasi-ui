const express = require('express');
const {getCompiler, applyCompilerMiddleware} = require('./bundler');
const settings = require('./getSettings')();

const server = express();
const compiler = getCompiler(settings);
applyCompilerMiddleware(server, compiler, settings);
server.use(require('connect-history-api-fallback'));
server.use(express.static(compiler.options.paths.OUTPUT));
server.listen(settings.port, settings.hostname, () => {
  const msg = `Listening on ${settings.hostname}:${settings.port}.`;
  const banner = new Array(msg.length + 1).join('=');
  console.log(`${banner}\n${msg}\n${banner}`);
});
