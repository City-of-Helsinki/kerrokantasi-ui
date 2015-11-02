const args = require('minimist')(process.argv.slice(2));
const serverUrl = process.env.SERVER_URL || 'http://127.0.0.1:8086';
const {hostname, port} = require('url').parse(serverUrl);
const webpack = require('webpack');
function run(server) {
  server.listen(port, hostname, () => {
    const msg = `Listening on ${hostname}:${port}.`;
    const banner = new Array(msg.length + 1).join('=');
    console.log(`${banner}\n${msg}\n${banner}`);
  });
}
if (args.dev) {
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('./conf/webpack/dev')(serverUrl);
  const compiler = webpack(config);
  compiler.plugin('compile', () => {
    console.log('Bundling...');
  });
  if (args.cold) {
    compiler.run(function(err, stats) {
      console.log(stats.toString({assets: true, chunkModules: false, chunks: true, colors: true}));
    });
  } else {
    const server = new WebpackDevServer(compiler, {
      historyApiFallback: true,
      hot: true,
      inline: true,
      publicPath: config.output.publicPath,
      quiet: false,
      noInfo: false,
      stats: {assets: true, chunkModules: false, chunks: true, colors: true}
    });
    run(server);
  }
} else {
  const config = require('./conf/webpack/prod');
  const compiler = webpack(config);
  const express = require('express');
  const server = express();
  server.use(express.static(config.paths.OUTPUT));
  console.log("Building production bundle, please wait. This might take a little while.");
  compiler.run(function(err, stats) {
    if (err) throw new Error(`Webpack error: ${err}`);
    run(server);
  });
}
