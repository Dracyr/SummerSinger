'use strict';

var Reflux = require('reflux');
var Actions = require('./actions');

var WebSocketConnection = require('./lib/websocket_connection.js');
var socket = new WebSocketConnection('ws://localhost:16242/');

var StreamAudio = require('./lib/stream_audio');
var streamAudio = new StreamAudio('http://localhost:16242/stream.mp3');

var QueueWrapper = require('./lib/queue_wrapper');

var initialState = {
  playing: false,
  streaming: false,
  streamAudio: streamAudio,
  trackId: null,
  track: null,
  queue: new QueueWrapper(),
  queueVersion: '',
  library: {},
  libraryVersion: '',
  hwPlayback: false,
  hwVolume: 1
};

module.exports = Reflux.createStore({

  listenables: Actions,

  getInitialState: function() {
    this.state = initialState;
    return this.state;
  },

  init: function() {
    socket.on('connect', function() {
      socket.emit('login', { username: 'Admin-GcVB6_7H', password: 'cMK_af_gx7W-G79BuY_pgnxDhrPjv4HO'});
      socket.emit('setStreaming', false);
      socket.emit('subscribe', {name: 'currentTrack'});
      socket.emit('subscribe', {name: 'queue', delta: true, version: null});
      socket.emit('subscribe', {name: 'library', delta: true, version: null});
      socket.emit('subscribe', {name: 'playlists', delta: false, version: null});
      socket.emit('subscribe', {name: 'hardwarePlayback'});
      socket.emit('subscribe', {name: 'volume'});

      /*
      socket.emit('subscribe', {name: 'repeat'});
      socket.emit('subscribe', {name: 'streamers'});
      socket.emit('subscribe', {name: 'events', delta: true, version: this.eventsVersion, });
      socket.emit('subscribe', {name: 'scanning', delta: true, version: this.scanningFromServerVersion, });
      socket.emit('subscribe', {name: 'users', delta: true, version: this.usersFromServerVersion, });
      socket.emit('subscribe', {name: 'importProgress', delta: true, version: this.importProgressFromServerVersion, });
      */
    });
    // Set up event handlers

    socket.on('currentTrack', this.onSocketCurrentTrack.bind(this));
    socket.on('queue', this.onSocketQueue.bind(this));
    socket.on('library', this.onSocketLibrary.bind(this));
    socket.on('playlists', this.onSocketPlaylist.bind(this));
    socket.on('hardwarePlayback', this.onSocketHardwarePlayback.bind(this));
    socket.on('volume', this.onSocketVolume.bind(this));
  },

  onSetPlaying: function(playing) {
    var play = playing ? 'play' : 'pause';
    socket.emit(play);
  },

  onNextTrack: function() {
    var currentTrack = this.state.trackId;
    if (currentTrack) {
      var nextTrackId = this.state.queue.nextItem(currentTrack.currentItemId);
      socket.emit('seek', {id: nextTrackId, pos: 0});
    }
  },

  onPreviousTrack: function() {
    var currentTrack = this.state.trackId;
    if (currentTrack) {
      var previousTrackId = this.state.queue.previousItem(currentTrack.currentItemId);
      socket.emit('seek', {id: previousTrackId, pos: 0});
    }
  },

  onSetStreaming: function(streaming) {
    this.state.streaming = streaming;
    if (streaming) {
      socket.emit('setStreaming', true);
      if (this.state.playing) {
        this.state.streamAudio.play();
      }
    } else {
      socket.emit('setStreaming', false);
      this.state.streamAudio.pause();
    }
    this.trigger(this.state);
  },

  onSeek: function(seekPercent) {
    var track = this.state.track;
    if (track) {
      var seekDuration = seekPercent * track.duration;
      var currentItemId = this.state.trackId.currentItemId;
      socket.emit('seek', {id: currentItemId, pos: seekDuration});
    }
  },

  onPlayTrack: function(trackId) {
    socket.emit('seek', {id: trackId, pos: 0});
  },

  onAddTrackToQueue: function(trackKey) {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
    var data = {};
    data[uuid] = {key: trackKey, sortKey: this.state.queue.getLastSortKey()};
    socket.emit('queue', data);
  },

  onSetHwPlayback: function(hwPlayback) {
    socket.emit('hardwarePlayback', hwPlayback);
  },

  onSetHwVolume: function(volume) {
    socket.emit('setvol', volume);
  },

  /******************
   * Socket Actions *
   ******************/

  onSocketCurrentTrack: function(trackId) {
    this.state.trackId = trackId;
    this.state.playing = trackId.isPlaying;

    if (this.state.library) {
      this.state.track = this.state.library[trackId.key];
    }
    if (this.state.playing && this.state.streaming) {
      this.state.streamAudio.play();
    } else {
      this.state.streamAudio.pause();
    }

    this.trigger(this.state);
  },

  onSocketQueue: function(queue) {
    this.state.queueVersion = queue.version;
    if (queue.reset) {
      this.state.queue.reset(queue.delta);
    } else {
      this.state.queue.update(queue.delta);
    }

    this.trigger(this.state);
  },

  onSocketLibrary: function(library) {
    this.state.libraryVersion = library.version;
    if (library.reset) {
      this.state.library = library.delta;
      this.state.queue.setLibrary(library.delta);
    }
    if (!this.state.track && this.state.trackId) {
      this.state.track = this.state.library[this.state.trackId.key];
    }

    this.trigger(this.state);
  },

  onSocketPlaylist: function(playlists) {
    this.state.playlists = playlists;
    this.trigger(this.state);
  },

  onSocketHardwarePlayback: function(playback) {
    this.state.hwPlayback = playback;
    this.trigger(this.state);
  },

  onSocketVolume: function(volume) {
    this.state.hwVolume = volume;
    this.trigger(this.state);
  }
});
