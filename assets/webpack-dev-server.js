var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config");

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  hot: true,
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
    timings: false,
    chunks: false,
    chunkModules: false
  },
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  headers: { "Access-Control-Allow-Origin": "*" }
});

server.listen(8081, "0.0.0.0", function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("webpack-dev-server listening at http://localhost:8081");
});

// Exit on end of STDIN
process.stdin.resume();
process.stdin.on("end", function() {
  process.exit(0);
});
