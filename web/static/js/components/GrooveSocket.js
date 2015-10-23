import { setPlaying, socketStatusUpdate } from '../actionCreators';

import { Socket } from '../../../../deps/phoenix/web/static/js/phoenix';

export default class GrooveSocket {
  constructor(store) {
    this.store = store;

    let socket = new Socket('/socket');
    this.socket = socket;

    socket.connect();
    let broadcastChannel = socket.channel('status:broadcast', {});
    this.broadcastChannel = broadcastChannel;

    broadcastChannel.join().receive('ok', channel => {
      console.log('Connected to broadcast channel');
    });

    broadcastChannel.on('statusUpdate', this.statusUpdate.bind(this));

    this.state = this.state.bind(this);
  }

  state() {
    return this.store.getState().default;
  }

  statusUpdate(statusUpdate) {
    this.store.dispatch(socketStatusUpdate(statusUpdate));
  }

  play(play) {
    this.broadcastChannel.push('playback', {playback: play});
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
