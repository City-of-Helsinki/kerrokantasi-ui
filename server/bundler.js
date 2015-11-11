const webpack = require('webpack');

export function getCompiler(settings) {
  var config;
  if (settings.dev) {
    config = require('../conf/webpack/dev')(settings.serverUrl);
  } else {
    config = require('../conf/webpack/prod');
  }

  return webpack(config);

}

export function applyCompilerMiddleware(server, compiler, settings) {
  if (settings.dev) {
    server.use(require('webpack-dev-middleware')(compiler, {
      publicPath: compiler.options.output.publicPath,
      quiet: false,
      noInfo: false,
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
      server.use(require('webpack-hot-middleware')(compiler));
    }
  }
}
