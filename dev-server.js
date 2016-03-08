var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  hot: true,
  stats: { colors: true },
});

server.listen(4001, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('webpack-dev-server listening at http://localhost:4001');
});

// Exit on end of STDIN
process.stdin.resume();
process.stdin.on('end', function () {
  process.exit(0);
});
