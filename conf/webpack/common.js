const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.resolve(ROOT, 'src');
const ASSETS = path.resolve(ROOT, 'assets');

module.exports = {
  entry: [
    'babel-polyfill'
  ],
  paths: {
    ROOT,
    SRC,
    ASSETS,
    ENTRY: path.resolve(SRC, 'index.js'),
    OUTPUT: path.resolve(ROOT, 'dist')
  },
  module: {
    loaders: [
      {test: /\.png$/, loader: 'url?limit=100000&mimetype=image/png'},
      {test: /\.svg(\?v=.+)?$/, loader: 'url?limit=100000&mimetype=image/svg+xml'},
      {test: /\.gif$/, loader: 'url?limit=100000&mimetype=image/gif'},
      {test: /\.jpg$/, loader: 'file'},
      {test: /\.woff(2)?(\?v=.+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.(ttf|eot)(\?v=.+)?$/, loader: 'file'},
      {test: /\.css$/, loader: 'style!css!postcss'},
      {test: /\.scss$/, loader: 'style!css!postcss!sass'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.md$/, loader: 'html!markdown'},
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    root: [ROOT],
    modulesDirectories: ['node_modules', 'app']
  },
  plugins: [new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fi|sv/)],
};
