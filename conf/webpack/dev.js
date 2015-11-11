/* eslint-disable no-var */

var common = require('./common');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var path = require('path');
var webpack = require('webpack');

module.exports = function(serverUrl) {
  return merge(common, {
    serverUrl: serverUrl,
    entry: [
      'webpack-hot-middleware/client',
      common.paths.ENTRY
    ],
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: common.paths.OUTPUT,
      filename: 'app.js'
    },
    module: {
      preLoaders: [
        {test: /\.js$/, include: common.paths.SRC, loader: 'eslint'}
      ],
      loaders: [
        {test: /\.js$/, include: common.paths.SRC, loaders: ['react-hot', 'babel']}
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEVTOOLS__: true,
        'process.env': {NODE_ENV: JSON.stringify('development')}
      }),
      new HtmlWebpackPlugin({inject: true, template: common.paths.HTML_TEMPLATE}),
      new webpack.HotModuleReplacementPlugin()
      //new webpack.NoErrorsPlugin()  // https://github.com/MoOx/eslint-loader#noerrorsplugin
    ]
  });
};
