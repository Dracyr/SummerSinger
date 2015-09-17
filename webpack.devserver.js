var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  // It suppress error shown in console, so it has to be set to false.
  quiet: false,
  // It suppress everything except error, so it has to be set to false as well
  // to see success build.
  noInfo: false,
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: true,
    chunkModules: false
  }
}).listen(4001, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('webpack-dev-server running on localhost:4001');
});

// Exit on end of STDIN
process.stdin.resume()
process.stdin.on('end', function () {
  process.exit(0)
})
