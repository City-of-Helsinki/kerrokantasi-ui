const webpack = require('webpack');
const paths = require('../paths');
const path = require('path');
const assetPaths = require('../assetPaths');


const plugins = [
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fi|sv/),
];

if (process.env.BUNDLE_ANALYZER) {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  plugins.push(new BundleAnalyzerPlugin());
}


module.exports = {
  context: paths.ROOT,
  optimization: {
    moduleIds: 'named',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.sass', '.json'],
    alias: {
      '@city-config': assetPaths.cityConfig,
      '@city-assets': assetPaths.cityAssets,
      '@city-i18n': assetPaths.cityi18n,
      '@city-images': assetPaths.cityImages,
      'kerrokantasi-ui': path.resolve(__dirname, '../../'),
      'kerrokantasi-ui-modules': path.resolve(__dirname, '../../node_modules'),
    },
    fallback: {
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  entry: [
    'babel-polyfill',
  ],
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
        type: 'asset/inline',
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
        type: 'asset/resource'
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
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
            }
          },
          {
            loader: 'markdown-loader',
          },
        ]
      },
    ]
  },
  plugins: plugins,
};
