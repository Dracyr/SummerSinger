import { socketStatusUpdate, queueUpdate } from '../app/Player/actions';
import { receivePlaylists } from '../app/Playlist/actions';

import { Socket } from 'phoenix';

export default class SummerSocket {
  constructor() {
    const socket = new Socket('/socket');
    this.socket = socket;
  }

  initialize(store) {
    this.store = store;
    const socket = this.socket;

    socket.connect();
    const broadcastChannel = socket.channel('status:broadcast', {});
    this.broadcastChannel = broadcastChannel;

    broadcastChannel.join().receive('ok', initInfo => {
      this.store.dispatch(socketStatusUpdate(initInfo.statusUpdate));
      this.store.dispatch(queueUpdate(initInfo.queue.queue));
      console.log('Summer connected to broadcast channel');
    });

    broadcastChannel.on('statusUpdate', this.statusUpdate.bind(this));
    broadcastChannel.on('queueUpdate', this.queueUpdate.bind(this));
    broadcastChannel.on('playlistsUpdate', this.playlistsUpdate.bind(this));

    this.state = this.state.bind(this);
  }

  state() {
    return this.store.getState().default;
  }

  statusUpdate(statusUpdate) {
    this.store.dispatch(socketStatusUpdate(statusUpdate));
  }

  queueUpdate(json) {
    this.store.dispatch(queueUpdate(json.queue));
  }

  playlistsUpdate(json) {
    this.store.dispatch(receivePlaylists(json.data));
  }

  requestPlayback(playback) {
    this.broadcastChannel.push('playback', { playback });
  }

  requestQueueTrack(trackId) {
    this.broadcastChannel.push('queue_track', { track_id: trackId });
  }

  requestPlayTrack(queueId) {
    this.broadcastChannel.push('play_queued_track', { queue_id: queueId });
  }

  requestPreviousTrack() {
    this.broadcastChannel.push('previous_track');
  }

  requestNextTrack() {
    this.broadcastChannel.push('next_track');
  }

  requestSeek(percent) {
    this.broadcastChannel.push('seek', { percent });
  }

  seek(seekPercent) {
    const track = this.state().track;
    if (track) {
      const seekDuration = seekPercent * track.duration;
      const currentItemId = this.state().statusUpdate.currentItemId;
      this.socket.emit('seek', { id: currentItemId, pos: seekDuration });
    }
  }
}
