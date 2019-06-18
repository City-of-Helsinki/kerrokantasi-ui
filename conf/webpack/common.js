const webpack = require('webpack');
const paths = require('../paths');
const path = require('path');
const assetPaths = require('../assetPaths');

const plugins = [
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fi|sv/),
];

if (process.env.BUNDLE_ANALYZER) {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
  plugins.push(new BundleAnalyzerPlugin());
}


module.exports = {
  context: paths.ROOT,
  resolve: {
    alias: {
      "kerrokantasi-ui": path.resolve(__dirname, '../../'),
      "kerrokantasi-ui-modules": path.resolve(__dirname, '../../node_modules'),
      "@city-config": assetPaths.cityConfig,
      "@city-assets": assetPaths.cityAssets,
      "@city-i18n": assetPaths.cityi18n,
      "@city-images": assetPaths.cityImages,
    }
  },
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
    ]
  },
  plugins: plugins,
};
