var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  cache: true,
  devtool: '#inline-source-map',
  entry: {
    Index: [
      'webpack-dev-server/client?http://localhost:3002',
      'webpack/hot/dev-server',
      'mocha!./test/unit/store/reducers/productionOrderItem.spec.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'test'),
    filename: 'test.js'
  },
  resolve: {
    alias: { '~': path.join(__dirname, 'client') },
    extensions: ["", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/, loaders: ['babel']
      }
    ]
  },
  plugins: [
    new OpenBrowserPlugin({
      url: 'http://localhost:3002/test'
    })
  ]
};
