import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestQueueAndPlayTrack } from '../Player/actions';
import * as PlaylistActions from './actions';

import Playlist from './Playlist';

class PlaylistView extends Component {
  componentDidMount() {
    const { playlist, actions } = this.props;

    if (playlist) {
      actions.fetchPlaylist(playlist.id);
    }
  }

  componentDidUpdate() {
    const { playlist, actions } = this.props;

    if (playlist) {
      actions.fetchPlaylist(playlist.id);
    }
  }

  render() {
    const { playlist, requestQueueAndPlayTrack, currentId } = this.props;
    if (!playlist) { return null; }

    return (
      <Playlist
        playlist={playlist}
        currentId={currentId}
        requestQueueAndPlayTrack={requestQueueAndPlayTrack}
      />
    );
  }
}

function mapState(state, ownProps) {
  const playlistId = parseInt(ownProps.match.params.playlistId, 10);
  const playlist = state
    .playlist
    .playlists.find(p => (p.id === playlistId ? p : false));

  return {
    playlist,
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(PlaylistActions, dispatch),
    requestQueueAndPlayTrack: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
  };
}

export default connect(mapState, mapDispatch)(PlaylistView);
