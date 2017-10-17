let path = require('path');
let webpackConfig = require('./webpack.config.dev2.karma');

module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: [
            'jasmine',
        ],
        files: [
            './node_modules/es6-shim/es6-shim.js',
            './test/unit.js',
        ],
        preprocessors: {
            'test/unit.js': ['webpack'],
        },
        reporters: [
            'mocha',
            'html',
            'coverage',
            'threshold',
        ],
        coverageReporter: {
            dir: 'reports/coverage',
            reporters: [
                { type: 'html', subdir: '.' },
                { type: 'json', subdir: '.', file: 'coverage-unmap.json' },
            ]
        },
        htmlReporter: {
            outputDir: 'reports/unit-test', // where to put the reports
            templatePath: null, // set if you moved jasmine_template.html
            focusOnFailures: true, // reports show failures on start
            namedFiles: true, // name files instead of creating sub-directories
            pageTitle: null, // page title for reports; browser info by default
            urlFriendlyName: true, // simply replaces spaces with _ for files/dirs
            reportName: 'index', // report summary filename; browser info by default

            // experimental
            preserveDescribeNesting: false, // folded suites stay folded
            foldAll: false, // reports start folded (only with preserveDescribeNesting)
        },
        thresholdReporter: {
            statements: 0,
            branches: 0,
            functions: 0,
            lines: 0
        },
        webpack: webpackConfig,
        webpackMiddleware: { stats: 'errors-only' },
    });
};
