'use strict';

/*
  This file is now unused, but it serves as an
  example on how to stream audio over http
  should that be needed later again
*/

module.exports = (function() {
  function StreamAudio(url) {
    this.url = url;
    this.streamAudio = new Audio(url);
  }

  StreamAudio.prototype.play = function() {
    var streamAudio = this.streamAudio;
    streamAudio.load();
    streamAudio.play();
    streamAudio.pause();

    setTimeout(function() {
      streamAudio.load();
      streamAudio.play();
    }, 200);
  };

  StreamAudio.prototype.pause = function() {
    var streamAudio = this.streamAudio;
    streamAudio.load();
    streamAudio.pause();
  };

  return StreamAudio;
})();
