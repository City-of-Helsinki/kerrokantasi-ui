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
    new webpack.optimize.CommonsChunkPlugin({minChunks: 3, children: true, async: "common"}),
    new webpack.optimize.UglifyJsPlugin({output: {comments: false}}),
    new webpack.LoaderOptionsPlugin({minimize: true}),
  ]
});
