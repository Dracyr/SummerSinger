import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestQueueAndPlayTrack } from '../Player/actions';
import * as PlaylistActions from './actions';

import Playlist from './Playlist';

class PlaylistView extends Component {
  componentDidMount() {
    const { currentPlaylist, actions } = this.props;
    if (currentPlaylist) {
      actions.fetchPlaylist(currentPlaylist.id);
    }
  }

  componentDidUpdate() {
    const { currentPlaylist, actions } = this.props;
    if (currentPlaylist) {
      actions.fetchPlaylist(currentPlaylist.id);
    }
  }

  render() {
    const { currentPlaylist, requestQueueAndPlayTrack } = this.props;

    return (
      <Playlist playlist={currentPlaylist}
        requestQueueAndPlayTrack={requestQueueAndPlayTrack}
      />
    );
  }
}

function mapState(state) {
  const currentPlaylist = state.playlist.playlists.find((playlist) => {
    return playlist.id === state.views.playlist ? playlist : false;
  });

  return {
    currentPlaylist,
    playlistView: state.playlist.playlistView,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(PlaylistActions, dispatch),
    requestQueueAndPlayTrack: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
  };
}

export default connect(mapState, mapDispatch)(PlaylistView);


