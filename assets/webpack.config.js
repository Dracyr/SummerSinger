var path    = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var env = process.env.MIX_ENV || 'dev';
var prod = env === 'prod';
var publicPath = 'http://localhost:8081/';

var plugins = [
  new CopyWebpackPlugin([{ from: './static', to: '../' }]),
];

var output = {
  path: path.join(__dirname, '../priv/static'),
  filename: 'bundle.js',
};

if (prod) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
  plugins.push(new webpack.NamedModulesPlugin());
  output = Object.assign(output, { publicPath: publicPath });
}

var entry = './static/js/index.js';

module.exports = {
  devtool: prod ? null : 'eval',
  entry: prod ? entry : [
    // activate HMR for React
    'react-hot-loader/patch',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:8081',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',
    entry,
  ],
  output: output,
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      loaders: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['react', ['es2015', { modules: false }]],
        plugins: ['transform-object-rest-spread', 'transform-class-properties'],
      },
    }],
  },
};
