'use strict';

module.exports = (function() {
  function QueueWrapper() {
    this.queue    = null;
    this.queueIds = null;
    this.library  = null;
  }

  function sortQueue(queue) {
    return queue.sort(function(a, b) {
      if (a.sortKey === b.sortKey) {
        if    (a.id === b.id)    { return 0; }
        else if (a.id < b.id) { return -1; }
        else                  { return 1; }
      } else if (a.sortKey < b.sortKey) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  function queueToArray(queueIds, library) {
    var queue = [];
    for(var trackId in queueIds) {
      var queueElement = queueIds[trackId];
      if (!queueElement) { continue; }
      var track = library[queueElement.key];
      // Duplicate track to prevent overwriting original.
      track = JSON.parse(JSON.stringify(track));
      if (track) {
        track.id = trackId;
        track.sortKey = queueElement.sortKey;
        queue.push(track);
      }
    }
    return sortQueue(queue);
  }

  QueueWrapper.prototype.reload = function() {
    if (this.library && this.queueIds) {
      this.queue = queueToArray(this.queueIds, this.library);
    }
  };

  QueueWrapper.prototype.setLibrary = function(library) {
    this.library = library;
    this.reload();
  };

  QueueWrapper.prototype.reset = function(queueIds) {
    this.queueIds = queueIds;
    this.reload();
  };

  QueueWrapper.prototype.update = function(newQueue) {
    var queueIds = this.queueIds;
    var changedTracks = Object.keys(newQueue);

    for (var i = changedTracks.length - 1; i >= 0; i--) {
      var trackKey = changedTracks[i];
      if (!newQueue[trackKey]) { //key is set to null in newQueue, remove item.
        queueIds[trackKey] = null;
      } else if (!queueIds[trackKey]) { //key does not exist in queue, add item.
        queueIds[trackKey] = newQueue[trackKey];
      } else { // update item
        queueIds[trackKey].sortKey = newQueue[trackKey].sortKey;
      }
    }
    this.queueIds = queueIds;
    this.queue = queueToArray(queueIds, this.library);
  };

  QueueWrapper.prototype.getQueue = function() {
    if (this.library && this.queue) {
      return this.queue;
    } else {
      return [];
    }
  };

  function findItemIndex(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
        return i;
      }
    }
  }

  QueueWrapper.prototype.nextItem = function(currentId) {
    var index = findItemIndex(this.queue, 'id', currentId);
    return this.queue[index + 1].id;
  };

  QueueWrapper.prototype.previousItem = function(currentId) {
    var index = findItemIndex(this.queue, 'id', currentId);
    return this.queue[index - 1].id;
  };

  QueueWrapper.prototype.getLastSortKey = function() {
    var queue = this.queue;
    var lastItem = queue[queue.length - 1];
    return lastItem.sortKey + '1';
  };

  return QueueWrapper;
})();
