const webpack = require('webpack');
const paths = require('../paths');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fi|sv/),
];

if (process.env.BUNDLE_ANALYZER) {
  plugins.push(new BundleAnalyzerPlugin());
}


module.exports = {
  context: paths.ROOT,
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
