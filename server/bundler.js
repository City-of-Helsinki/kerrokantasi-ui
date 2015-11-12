const webpack = require('webpack');
const ProgressBar = require('progress');

function getProgressPlugin() {
  const progress = new ProgressBar(
    '[:bar] :percent :etas :state',
    {incomplete: ' ', complete: '#', width: 60, total: 100}
  );
  return new webpack.ProgressPlugin(function (percentage, msg) {
    progress.update(percentage, {state: msg.replace(/[\r\n]/g, '')});
  });
}

export function getCompiler(settings, withProgress) {
  var config;
  if (settings.dev) {
    config = require('../conf/webpack/dev')(settings.serverUrl);
  } else {
    config = require('../conf/webpack/prod');
  }
  if (withProgress && process.stdout.isTTY) {
    config.plugins.push(getProgressPlugin());
  }
  const compiler = webpack(config);
  compiler.plugin('emit', (compilation, compileCallback) => {
    const stats = compilation.getStats().toJson();
    const chunks = stats.chunks.sort((a, b) => (a.entry !== b.entry ? b.entry ? 1 : -1 : b.id - a.id));
    settings.bundleSrc = (compilation.options.output.publicPath || "./") + chunks[0].files[0];
    compileCallback();
  });
  return compiler;
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
