'use strict';

var path    = require('path');
var webpack = require('webpack');

var env = process.env.MIX_ENV || 'dev';
var prod = env === 'prod';

var entry = './web/static/js/index.js';
var plugins = [new webpack.NoErrorsPlugin()];
var loaders = ['babel'];
var publicPath = 'http://localhost:4001/';

if (prod) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  loaders.unshift('react-hot');
}

module.exports = {
  devtool: prod ? null : 'eval-sourcemaps',
  entry: prod ? entry : [
    'webpack-dev-server/client?' + publicPath,
    'webpack/hot/only-dev-server',
    entry
  ],
  output: {
    path: path.join(__dirname, './priv/static/js'),
    filename: 'bundle.js',
    publicPath: publicPath
  },
  plugins: plugins,
  module: {
    loaders: [
      { test: /\.jsx?/, loaders: loaders, exclude: /node_modules/ }
    ]
  }
};
