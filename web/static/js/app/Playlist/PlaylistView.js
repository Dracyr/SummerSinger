import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestQueueTrack } from '../Player/actions';
import * as PlaylistActions from './actions';

import Playlist from './Playlist';
import CreatePlaylist from './CreatePlaylist';

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
    const { currentPlaylist, requestQueueTrack, playlistView } = this.props;

    switch(playlistView) {
      case 'SHOW':
        return (
          <Playlist playlist={currentPlaylist}
            requestQueueTrack={requestQueueTrack}
          />
        );
      case 'CREATE':
        return <CreatePlaylist />;
      default:
        return '';
    }
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
    requestQueueTrack: (...args) => dispatch(requestQueueTrack(...args)),
  };
}

export default connect(mapState, mapDispatch)(PlaylistView);


