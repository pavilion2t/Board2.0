'use strict';

var path = require('path');
var baseConfig = require('./webpack.config.dev2');

baseConfig.debug = false;
baseConfig.devtool = 'inline-source-map';
baseConfig.entry = {};

baseConfig.module.loaders.push({
    test: /\.jsx?$/,
    include: path.join(__dirname, 'test'),
    loaders: ['babel']
});

baseConfig.module.postLoaders = [
    {
        test: /\.jsx?$/,
        include: [
            path.resolve('client'),
        ],
        loader: 'istanbul-instrumenter',
    }
];

baseConfig.externals = {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ReactContext': true,
    'react/lib/ExecutionEnvironment': true,
};

module.exports = baseConfig;
