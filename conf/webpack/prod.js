const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const common = require('./common');
const paths = require('../paths');

module.exports = merge(common, {
  entry: [paths.ENTRY],
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          sourceMap: true, // Must be set to true if using source-maps in production
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ],
    splitChunks: {
      chunks: 'async',
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ],
  },
});
