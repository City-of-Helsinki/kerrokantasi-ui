const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./common');
const paths = require('../paths');

module.exports = function getDevConfig() {
  return merge(common, {
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
          test: /\.js$/,
          include: paths.SRC,
          use: [
            {
              loader: 'react-hot-loader/webpack',
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['react'],
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
      new webpack.LoaderOptionsPlugin({debug: false}),
    ],
  });
};
