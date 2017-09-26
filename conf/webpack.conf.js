const webpack = require('webpack');
const paths = require('./paths');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const KKUIConfigPlugin = require('./KKUIConfigPlugin');

const baseConfig = {
  context: paths.ROOT,
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
  ],
  output: {
    path: paths.OUTPUT,
    publicPath: '/',
    filename: 'app.[hash].js'
  },
  module: {
    rules: [
      {test: /\.png$/, loader: 'url-loader?limit=100000&mimetype=image/png'},
      {test: /\.svg(\?v=.+)?$/, loader: 'url-loader?limit=100000&mimetype=image/svg+xml'},
      {test: /\.gif$/, loader: 'url-loader?limit=100000&mimetype=image/gif'},
      {test: /\.jpg$/, loader: 'file-loader'},
      {test: /\.woff(2)?(\?v=.+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.(ttf|eot)(\?v=.+)?$/, loader: 'file-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader'},
      {test: /\.md$/, loader: 'html-loader!markdown-loader'},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fi|sv/),
    new HtmlWebpackPlugin({
      title: 'Kerro Kantasi',
      template: path.join(__dirname, 'template.html.ejs'),
    }),
    new KKUIConfigPlugin(),
  ],
  devServer: {
    contentBase: [
      path.join(paths.ROOT),  // to serve /assets/
    ],
    proxy: {
      "/me": "http://localhost:8086",
      "/auth": "http://localhost:8086",
    },
  },
};

const productionConfigOverlay = {
  entry: [paths.ENTRY],
  plugins: [
    new webpack.DefinePlugin({
      __DEVTOOLS__: false,
      'process.env': {NODE_ENV: JSON.stringify('production')}
    }),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
  ]
};

const developmentConfigOverlay = {
  entry: [
    'react-hot-loader/patch',
    paths.ENTRY,
  ],
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      __DEVTOOLS__: true,
      'process.env': {NODE_ENV: JSON.stringify('development')}
    }),
  ],
};

module.exports = function (env) {
  const isProduction = (process.env.NODE_ENV === 'production' || env === 'production');
  return merge(
    baseConfig,
    (isProduction ? productionConfigOverlay : developmentConfigOverlay)
  );
};
