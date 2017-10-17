'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('../../webpack.config.dev2.express.js');
const open = require("open");

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../..//dist/index.html'));
});

/* eslint-disable no-console */
app.listen(process.env.PORT, 'localhost', function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening at http://localhost:' + process.env.PORT);
  open(`http://localhost:${process.env.PORT}`);
});
/* eslint-enable no-console */
