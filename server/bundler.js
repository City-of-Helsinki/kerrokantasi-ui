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

export function getCompiler(settings, withProgress) {
  let config;
  if (settings.dev) {
    config = require('../conf/webpack/dev');
  } else {
    config = require('../conf/webpack/prod');
  }
  if (withProgress && process.stdout.isTTY) {
    config.plugins.push(getProgressPlugin());
  }
  const compiler = webpack(config);

  compiler.hooks.emit.tapAsync('Compiled', (compilation) => {
    const stats = compilation.getStats().toJson();
    settings.bundleSrc = stats.hash;
  });
  
  compiler.hooks.afterEmit.tapAsync('Finished', () => {
    console.log('jaa-a');
    fs.writeFileSync(
      path.resolve(paths.OUTPUT, 'bundle_src.txt'),
      settings.bundleSrc,
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
