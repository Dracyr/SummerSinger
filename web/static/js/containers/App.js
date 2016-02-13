import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PlayerActions from '../actions/player';
import * as LibraryActions from '../actions/library';
import * as ViewsActions from '../actions/views';

import Summer from '../components/Summer';

function mapState(state) {
  return {
    view: state.views.view,
    playing: state.player.playing,
    currentTrack: state.player.currentTrack,
    queueIndex: state.player.queueIndex,
    startTime: state.player.startTime,
    pausedDuration: state.player.pausedDuration,
    duration: state.player.duration,
    library: state.library,
    queue: state.player.queue,
    playlists: state.library.playlists
  };
}

function mapDispatch(dispatch) {
  return {
    actions:  {
      player:   bindActionCreators(PlayerActions, dispatch),
      library:  bindActionCreators(LibraryActions, dispatch),
      views:     bindActionCreators(ViewsActions, dispatch)
    }
  };
}

export default connect(mapState, mapDispatch)(Summer);
