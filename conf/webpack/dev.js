const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./common');
const paths = require('../paths');

module.exports = merge(common, {
  entry: [
    'webpack-hot-middleware/client',
    paths.ENTRY,
  ],
  devServer: {
    host: '0.0.0.0'
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              preset: ['@babel/preset-env', '@babel/preset-react']
            }
          },
          {
            loader: 'react-hot-loader/webpack',
            options: {
              preset: ['@babel/preset-env', '@babel/preset-react']
            }
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
    new webpack.LoaderOptionsPlugin({debug: true}),
  ],
});
