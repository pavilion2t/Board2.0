'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.deploy');

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('staging')
    })
  ]
});
