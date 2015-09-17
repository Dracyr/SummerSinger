'use strict';

var WebSocketConnection,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

WebSocketConnection = (function() {
  function WebSocketConnection(url) { // eslint-disable-line no-shadow
    this.url = url;
    this.onMessage = bind(this.onMessage, this);
    this.onOpen    = bind(this.onOpen, this);

    this.ws = new WebSocket(this.url);
    this.ws.onmessage = this.onMessage;
    this.ws.onopen = this.onOpen;
    this.callbacks = {};
    this.onOpenCallbacks = [];
  }

  WebSocketConnection.prototype.on = function(eventName, callback) {
    if (eventName === 'connect') {
      if (this.ws.readyState === 1) {
        callback.call; // eslint-disable-line no-unused-expressions
      } else {
        this.onOpenCallbacks.push(callback);
      }
    } else {
      if (!this.callbacks[eventName]) {
        this.callbacks[eventName] = [];
      }
      this.callbacks[eventName].push(callback);
    }
  };

  WebSocketConnection.prototype.onMessage = function(event) {
    var callback, eventData, eventName, i, len, message, ref, results;
    message = JSON.parse(event.data);
    eventName = message.name;
    eventData = message.args;

    // if (eventName != 'time') {
    //   if (typeof eventData != 'object') {
    //     console.log(eventName + ': ' + eventData);

    //   } else {
    //     console.log(eventName);
    //     console.log(eventData);
    //   }
    // }

    if (!this.callbacks[eventName]) {
      this.callbacks[eventName] = [];
    }

    ref = this.callbacks[eventName];
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      callback = ref[i];
      results.push(callback.call(this, eventData));
    }
    return results;
  };

  WebSocketConnection.prototype.onOpen = function() {
    var callback, i, len, ref, results;
    ref = this.onOpenCallbacks;

    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      callback = ref[i];
      results.push(callback.call());
    }
    return results;
  };


  WebSocketConnection.prototype.emit = function(eventName, params) {
    this.ws.send(JSON.stringify({
      name: eventName,
      args: params
    }));
  };

  return WebSocketConnection;
})();

module.exports = WebSocketConnection;
