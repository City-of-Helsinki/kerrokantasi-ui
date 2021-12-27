import fs from 'fs';
import paths from '../conf/paths';
import path from "path";

const webpack = require('webpack');
const ProgressBar = require('progress');
const debug = require('debug')('bundler');

function getProgressPlugin() {
  const progress = new ProgressBar(
    '[:bar] :percent :etas :state',
    {incomplete: ' ', complete: '#', width: 60, total: 100}
  );
  return new webpack.ProgressPlugin((percentage, msg) => {
    progress.update(percentage, {state: msg.replace(/[\r\n]/g, '')});
  });
}

function sortChunks(chunk1, chunk2) {
  if (chunk1.entry !== chunk2.entry) {
    return chunk2.entry ? 1 : -1;
  }
  return chunk2.id - chunk1.id;
}

export function getCompiler(settings, withProgress) {
  let config;
  if (settings.dev) {
    config = require('../conf/webpack/dev')();
  } else {
    config = require('../conf/webpack/prod');
  }
  if (withProgress && process.stdout.isTTY) {
    config.plugins.push(getProgressPlugin());
  }
  const compiler = webpack(config);
  compiler.plugin('emit', (compilation, compileCallback) => {
    const stats = compilation.getStats().toJson();
    const chunks = stats.chunks.sort(sortChunks);
    const bundleSrc = (compilation.options.output.publicPath || "./") + chunks[0].files[0];
    settings.bundleSrc = bundleSrc;  // eslint-disable-line no-param-reassign
    compileCallback();

    // Save bundle entrypoint filename to a known location.
    // We need to save the filename somewhere, as it contains a hash which is subject to changing
    // and it's required to start up the server from a bundle
    fs.writeFile(
      path.resolve(paths.OUTPUT, "bundle_src.txt"),
      bundleSrc,  // `/app.{SOME_HASH}.js`
      (err) => {
        if (err) { throw err; }
      }
    );
  });
  return compiler;
}

export function applyCompilerMiddleware(server, compiler, settings) {
  if (!settings.dev) return;
  debug("enabling dev-middleware");
  server.use(require('webpack-dev-middleware')(compiler, {
    publicPath: compiler.options.output.publicPath,
    stats: {
      assets: false,
      chunkModules: false,
      chunks: true,
      colors: true,
      hash: false,
      progress: false,
      timings: false,
      version: false
    }
  }));
  if (!settings.cold) {
    debug("enabling hot-middleware");
    server.use(require('webpack-hot-middleware')(compiler));
  }
}
