'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var baseConfig = require('./webpack.config.base2');

baseConfig.devtool ='source-map';
baseConfig.plugins.push(new webpack.optimize.DedupePlugin());
baseConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
baseConfig.plugins.push(new HtmlWebpackPlugin(
  {
    title: 'Bindo Dashboard',
    template: 'tools/buildScripts/index.ejs'
  }
));
baseConfig.plugins.push(new webpack.optimize.UglifyJsPlugin(
  {
    compress: {
      warnings: false
    }
  })
);
baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
  'process.env.CODE_BASE': JSON.stringify('d2')
}));
baseConfig.module.loaders.push({ test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap!postcss")});
baseConfig.output = {
  path: __dirname + '/dist',
  filename: 'bundle.[hash].js',
  publicPath: '/',
};

module.exports = baseConfig;
