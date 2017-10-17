'use strict';

var webpack = require('webpack');
var baseConfig = require('./webpack.config.base2');

baseConfig.cache = true;
baseConfig.debug = true;
baseConfig.devtool = '#inline-source-map';
baseConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
baseConfig.plugins.push(new webpack.NoErrorsPlugin());
baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.API_ENV': JSON.stringify('development'),
  'process.env.NODE_ENV': JSON.stringify('development'),
  'process.env.CODE_BASE': JSON.stringify('d2')
}));
baseConfig.entry.splice(0, 0, 'webpack-hot-middleware/client');
baseConfig.module.loaders.push({test: /(\.css|\.scss)$/, loader: "style!css!sass!postcss"});
baseConfig.output = {
  path: __dirname + '/dist',
  filename: 'bundle.js',
  publicPath: '/assets/'
};
module.exports = baseConfig;
