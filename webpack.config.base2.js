var path = require('path');
var webpack = require('webpack');
require('postcss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');


module.exports = {
  bail: true,
  noInfo: true,
  target: 'web',
  postcss: () => {
    return [autoprefixer];
  },
  resolve: {
    alias: {
      '~': path.join(__dirname, 'client'),
      '@': path.resolve(__dirname, './common'),
    },
    modulesDirectories: ['node_modules', 'bower_components']
  },
  resolveLoader: {
    modulesDirectories: [
      'node_modules'
    ]
  },
  entry: ['babel-polyfill', './client/index'],
  plugins: [
    new ExtractTextPlugin('bundle.[hash].css'),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'node_modules/which-gtin')
        ],
        loaders: ['babel', 'eslint']
      },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=./fonts/[name].[ext]" },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=./fonts/[name].[ext]" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.(png|jpg|csv)$/, loader: 'file-loader' }
    ]
  }
};
