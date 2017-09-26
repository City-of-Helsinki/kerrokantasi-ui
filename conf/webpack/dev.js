/* eslint-disable no-var, object-shorthand */

var merge = require('webpack-merge');
var webpack = require('webpack');
var common = require('./common');
var paths = require('../paths');

module.exports = function getDevConfig() {
  return merge(common, {
    entry: [
      'webpack-hot-middleware/client',
      paths.ENTRY,
    ],
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths.SRC,
          use: [
            {
              loader: 'react-hot-loader/webpack',
            },
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEVTOOLS__: true,
        'process.env': {NODE_ENV: JSON.stringify('development')}
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
};
