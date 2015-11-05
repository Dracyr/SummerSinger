import { socketStatusUpdate, queueUpdate } from '../actionCreators';

import { Socket } from '../../../../deps/phoenix/web/static/js/phoenix';

export default class GrooveSocket {
  constructor(store) {
    this.store = store;

    let socket = new Socket('/socket');
    this.socket = socket;

    socket.connect();
    let broadcastChannel = socket.channel('status:broadcast', {});
    this.broadcastChannel = broadcastChannel;

    broadcastChannel.join().receive('ok', initInfo => {
      this.store.dispatch(socketStatusUpdate(initInfo.statusUpdate));
      this.store.dispatch(queueUpdate(initInfo.queue.queue));
      console.log('Connected to broadcast channel');
    });

    broadcastChannel.on('statusUpdate', this.statusUpdate.bind(this));
    broadcastChannel.on('queueUpdate', this.queueUpdate.bind(this));

    this.state = this.state.bind(this);
  }

  state() {
    return this.store.getState().default;
  }

  statusUpdate(statusUpdate) {
    this.store.dispatch(socketStatusUpdate(statusUpdate));
  }

  queueUpdate(queue) {
    this.store.dispatch(queueUpdate(queue.queue));
  }

  requestPlayback(playback) {
    this.broadcastChannel.push('playback', {playback: playback});
  }

  requestQueueTrack(trackId) {
    this.broadcastChannel.push('queue_track', {track_id: trackId});
  }

  requestPlayTrack(queueId) {
    this.broadcastChannel.push('play_track', {queue_id: queueId});
  }

  requestPreviousTrack() {
    this.broadcastChannel.push('previous_track');
  }

  requestNextTrack() {
    this.broadcastChannel.push('next_track');
  }

  requestSeek(percent) {
    this.broadcastChannel.push('seek', {percent: percent});
  }

  seek(seekPercent) {
    let track = this.state().track;
    if (track) {
      let seekDuration = seekPercent * track.duration;
      let currentItemId = this.state().statusUpdate.currentItemId;
      this.socket.emit('seek', {id: currentItemId, pos: seekDuration});
    }
  }
}
