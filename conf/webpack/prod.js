const merge = require('webpack-merge');
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
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loaders: ['babel-loader'],
            options: {
              presets: ['react']
            }
          }
        ]
      },
    ],
  },
});
