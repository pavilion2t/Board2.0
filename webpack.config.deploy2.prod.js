'use strict';

var webpack = require('webpack');
var baseConfig = require('./webpack.config.deploy2');

baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.API_ENV': JSON.stringify('production'),
  'process.env.CODE_BASE': JSON.stringify('d2')
}));

module.exports = baseConfig;
