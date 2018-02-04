import { Socket } from 'phoenix';

import { socketStatusUpdate, fetchStatus } from '../app/Player/actions';
import { queueUpdate, fetchQueue } from '../app/Queue/actions';
import { receivePlaylists } from '../app/Playlist/actions';
import { trackUpdate } from '../app/Track/actions';
import { clearInbox } from '../app/Inbox/actions';

export default class SummerSocket {
  constructor() {
    const socket = new Socket('/socket');
    this.socket = socket;
  }

  initialize(store) {
    this.store = store;

    // Immediately request queue and status, in case websocket connection is slow
    this.store.dispatch(fetchQueue());
    this.store.dispatch(fetchStatus());

    this.socket.connect();
    const broadcastChannel = this.socket.channel('status:broadcast', {});
    this.broadcastChannel = broadcastChannel;

    broadcastChannel.join().receive('ok', (initInfo) => {
      this.store.dispatch(socketStatusUpdate(initInfo.statusUpdate));
      this.store.dispatch(queueUpdate(initInfo.queue.queue));
      console.log('Summer connected to broadcast channel');
    });

    broadcastChannel.on('statusUpdate', this.statusUpdate.bind(this));
    broadcastChannel.on('queueUpdate', this.queueUpdate.bind(this));
    broadcastChannel.on('playlistsUpdate', this.playlistsUpdate.bind(this));
    broadcastChannel.on('trackUpdate', this.trackUpdate.bind(this));
    broadcastChannel.on('clearInbox', this.clearInbox.bind(this));

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

  trackUpdate(json) {
    this.store.dispatch(trackUpdate(json.data));
  }

  clearInbox() {
    this.store.dispatch(clearInbox());
  }

  requestPlayback(playback) {
    this.broadcastChannel.push('playback', { playback });
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

  requestQueueTrack(trackId) {
    this.broadcastChannel.push('queue_track', { track_id: trackId, play: false });
  }

  requestPlayTrack(queueId) {
    this.broadcastChannel.push('play_track', { queue_id: queueId });
  }

  requestQueueAndPlayTrack(trackId) {
    this.broadcastChannel.push('queue_track', { track_id: trackId, play: true });
  }

  removeQueueTrack(trackIndex) {
    this.broadcastChannel.push('remove_queue_track', { track_index: trackIndex });
  }

  queueFolder(folderId, play = false) {
    this.broadcastChannel.push('queue_folder', { folder_id: folderId, play });
  }

  queuePlaylist(playlistId, play = false) {
    this.broadcastChannel.push('queue_playlist', { playlist_id: playlistId, play });
  }

  clearQueue() {
    this.broadcastChannel.push('clear_queue');
  }

  requestClearInbox() {
    this.broadcastChannel.push('clear_inbox');
  }

  requestVolume(percent) {
    this.broadcastChannel.push('volume', { percent });
  }

  addTrackToPlaylist(trackId, playlistId) {
    this.broadcastChannel.push('add_track_to_playlist', {
      track_id: trackId,
      playlist_id: playlistId,
    });
  }

  seek(seekPercent) {
    const { track } = this.state();

    if (track) {
      const pos = seekPercent * track.duration;
      const id = this.state().statusUpdate.currentItemId;
      this.socket.emit('seek', { id, pos });
    }
  }
}
