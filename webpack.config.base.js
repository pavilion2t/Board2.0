var path = require('path');
var webpack = require('webpack');


module.exports = {
  // bail: true,
  // noInfo: true,
  // target: 'web',
  // resolve: {
  //   alias: {
  //     '~': path.join(__dirname, 'src')
  //   },
  // },
  entry: ['./src/app/index.module.js'],
  module: {
    // preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel-loader']}
    ]
  },

  resolve: {
    alias: {
      '~': path.join('.tmp', 'client'),
    }
  },

  resolveLoader: {
    modulesDirectories: [
      'node_modules'
    ]
  },
  output: { filename: 'index.module.js' }
};
