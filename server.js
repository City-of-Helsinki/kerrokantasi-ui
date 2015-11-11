const args = require('minimist')(process.argv.slice(2));
const serverUrl = process.env.SERVER_URL || 'http://127.0.0.1:8086';
const {hostname, port} = require('url').parse(serverUrl);
const webpack = require('webpack');
const express = require('express');
const server = express();
var config = null;


function run(server) {
  server.listen(port, hostname, () => {
    const msg = `Listening on ${hostname}:${port}.`;
    const banner = new Array(msg.length + 1).join('=');
    console.log(`${banner}\n${msg}\n${banner}`);
  });
}

if (args.dev) {
  config = require('./conf/webpack/dev')(serverUrl);
} else {
  config = require('./conf/webpack/prod');
}

const compiler = webpack(config);

if (args.dev) {
  server.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    config: config.output.publicPath
  }));
  if (!args.cold) {
    server.use(require("webpack-hot-middleware")(compiler));
  }
}

server.use(require('connect-history-api-fallback'));
server.use(express.static(config.paths.OUTPUT));
run(server);
