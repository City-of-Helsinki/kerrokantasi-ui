/* eslint-disable no-var */

var merge = require('webpack-merge');
var webpack = require('webpack');
var common = require('./common');
var paths = require('../paths');

module.exports = merge(common, {
  entry: [paths.ENTRY],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVTOOLS__: false,
      'process.env': {NODE_ENV: JSON.stringify('production')}
    }),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new webpack.LoaderOptionsPlugin({minimize: true}),
  ]
});
