'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var react = require('gulp-react');
var babel = require('gulp-babel');

var browserSync = require('browser-sync');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var jsx = require('gulp-jsx');
var $ = require('gulp-load-plugins')();


function webpackWrapper(watch, test, callback) {
  var webpackOptions = {
    watch: watch,
    module: {
      // preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}],
      loaders: [{ test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel-loader?presets[]=es2015']}]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.CODE_BASE': JSON.stringify('d1')
      })
    ],
    output: { filename: 'index.module.js' }
  };

  if(watch) {
    webpackOptions.devtool = '#inline-source-map';
  }

  var webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }
    $.util.log(stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload();
    if(watch) {
      watch = false;
      callback();
    }
  };

  var sources = [ path.join(conf.paths.src, '/app/index.module.js') ];
  if (test) {
    sources.push(path.join(conf.paths.src, '/app/**/*.spec.js'));
  }

  return gulp.src(sources)
    .pipe(webpackStream(webpackOptions, null, webpackChangeHandler))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')));
}

gulp.task('scripts',[], function () {
  return webpackWrapper(false, false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
  return webpackWrapper(true, false, callback);
});

gulp.task('scripts:test', function () {
  return webpackWrapper(false, true);
});

gulp.task('scripts:test-watch', ['scripts'], function (callback) {
  return webpackWrapper(true, true, callback);
});


