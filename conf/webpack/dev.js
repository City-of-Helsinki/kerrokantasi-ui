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
        include: paths.SRC,
        use: [
          {
            loader: 'react-hot-loader/webpack',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            },
          },
          {
            loader: 'babel-loader',
          }
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
    new webpack.LoaderOptionsPlugin({debug: true}),
  ],
});
