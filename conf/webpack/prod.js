/* eslint-disable no-var */

var common = require('./common');
var merge = require('webpack-merge');
var webpack = require('webpack');

module.exports = merge(common, {
  entry: common.paths.ENTRY,
  debug: false,
  devtool: 'source-map',
  output: {
    path: common.paths.OUTPUT,
    publicPath: '/',
    filename: 'app.[hash].js'
  },
  module: {
    loaders: [
      {test: /\.js$/, include: common.paths.SRC, loaders: ['babel']}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVTOOLS__: false,
      'process.env': {NODE_ENV: JSON.stringify('production')}
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
  ]
});
