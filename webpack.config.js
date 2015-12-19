'use strict';

var path    = require('path');
var webpack = require('webpack');

var publicPath = 'http://localhost:4001/';

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './web/static/js/index.js',
    'webpack-hot-middleware/client?path=' + publicPath + "__webpack_hmr"
  ],
  output: {
    path: path.join(__dirname, './priv/static/js'),
    filename: 'bundle.js',
    publicPath: publicPath
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }]
  }
};
