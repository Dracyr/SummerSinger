var path    = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var env = process.env.MIX_ENV || 'dev';
var prod = env === 'prod';
var publicPath = 'http://localhost:4001/';

var plugins = [
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
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
  plugins.push(new webpack.NamedModulesPlugin());
  output = Object.assign(output, { publicPath: publicPath });
}

var entry = './web/static/js/index.js';


// eval - Each module is executed with eval and //@ sourceURL.
// source-map - A SourceMap is emitted. See also output.sourceMapFilename.
// hidden-source-map - Same as source-map, but doesn’t add a reference comment to the bundle.
// inline-source-map - A SourceMap is added as DataUrl to the JavaScript file.
// eval-source-map - Each module is executed with eval and a SourceMap is added as DataUrl to the eval.
// cheap-source-map - A SourceMap without column-mappings. SourceMaps from loaders are not used.
// cheap-module-source-map - A SourceMap without column-mappings. SourceMaps from loaders are simplified to a single mapping per line.

module.exports = {
  // devtool: prod ? null : 'cheap-source-map',
  devtool: prod ? null : 'inline-source-map',
  entry: prod ? entry : [
    'webpack-dev-server/client?' + publicPath,
    'webpack/hot/dev-server',
    entry,
  ],
  output: output,
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['react', ['es2015', { modules: false }]],
        plugins: ['transform-object-rest-spread', 'transform-class-properties'],
      },
    }],
  },
};
