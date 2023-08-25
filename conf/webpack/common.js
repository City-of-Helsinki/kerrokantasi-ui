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
  optimization: {
    moduleIds: 'named',
  },
  resolve: {
    extensions: ['.js', '.sass', '.json'],
    modules: ['src', 'node_modules'],
    alias: {
      '@city-config': assetPaths.cityConfig,
      '@city-assets': assetPaths.cityAssets,
      '@city-i18n': assetPaths.cityi18n,
      '@city-images': assetPaths.cityImages,
      'kerrokantasi-ui': path.resolve(__dirname, '../../'),
      'kerrokantasi-ui-modules': path.resolve(__dirname, '../../node_modules'),
    },
  },
  entry: paths.ENTRY,
  output: {
    hashFunction: "xxhash64",
    path: paths.OUTPUT,
    publicPath: '/',
    filename: 'app.[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.png$/, 
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              mimetype: 'image/png',
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              mimetype: 'image/svg+xml',
            }
          }
        ]
      },
      {
        test: /\.gif$/, 
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              mimetype: 'image/gif'
            }
          }
        ]
      },
      {
        test: /\.jpg$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              mimetype: 'application/font-woff'
            } 
          }
        ]
      },
      {
        test: /\.(ttf|eot)(\?v=.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              mimetype: 'image/gif' 
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.md$/,
        use: ['html-loader', 'markdown-loader']
      },
    ]
  },
  plugins: plugins,
};
