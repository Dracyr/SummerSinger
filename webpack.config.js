var path    = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var env = process.env.MIX_ENV || 'dev';
var prod = env === 'prod';
var publicPath = 'http://localhost:4001/';

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new CopyWebpackPlugin([{ from: './web/static/assets', to: '../' }]),
];

var output = {
  path: path.join(__dirname, './priv/static/js'),
  filename: 'bundle.js',
};

if (prod) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoErrorsPlugin());
  output = Object.assign(output, { publicPath: publicPath });
}

var entry = './web/static/js/index.js';

module.exports = {
  devtool: prod ? null : 'cheap-source-map',
  entry: prod ? entry : [
    'webpack-dev-server/client?' + publicPath,
    'webpack/hot/dev-server',
    entry,
  ],
  output: output,
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react', 'es2015'],
        plugins: ['transform-object-rest-spread'],
      },
    }],
  },
};
