'use strict';

var baseConfig = require('./webpack.config.dev2');
var HtmlWebpackPlugin  = require('html-webpack-plugin');

baseConfig.plugins.push(new HtmlWebpackPlugin(
  {
    title: 'Bindo Dashboard',
    template: 'tools/buildScripts/index.ejs'
  }
));

module.exports = baseConfig;
