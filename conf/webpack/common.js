const autoprefixer = require('autoprefixer');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const SRC = path.resolve(ROOT, 'src');

module.exports = {
  paths: {
    ROOT: ROOT,
    SRC: SRC,
    ENTRY: path.resolve(SRC, 'index.js'),
    OUTPUT: path.resolve(ROOT, 'dist'),
    HTML_TEMPLATE: path.resolve(__dirname, "template.html")
  },
  module: {
    loaders: [
      {test: /\.png$/, loader: 'url?limit=100000&mimetype=image/png'},
      {test: /\.svg$/, loader: 'url?limit=100000&mimetype=image/svg+xml'},
      {test: /\.gif$/, loader: 'url?limit=100000&mimetype=image/gif'},
      {test: /\.jpg$/, loader: 'file'},
      {test: /\.woff(2)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.(ttf$|eot)/, loader: 'file'},
      {test: /\.css$/, loader: 'style!css!postcss'},
      {test: /\.less$/, loader: 'style!css!postcss!less'}
    ]
  },
  postcss: [
    autoprefixer({browsers: ['last 2 version', 'ie 9']})
  ],
  resolve: {
    extensions: ['', '.js', '.json'],
    root: [ROOT, SRC],
    modulesDirectories: ['node_modules', 'app']
  }
};
