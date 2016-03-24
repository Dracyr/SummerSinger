import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TrackList from '../components/TrackList';
import { requestQueueTrack } from '../actions/player';

import * as LibraryActions from '../actions/library';

class Playlist extends Component {
  componentDidMount() {
    const {playlist, actions} = this.props;
    actions.library.fetchPlaylist(playlist.id);
  }

  componentDidUpdate() {
    const {playlist, actions} = this.props;
    actions.library.fetchPlaylist(playlist.id);
  }

  render() {
    const { playlist } = this.props;

    return (
      <div>
        <h1>{playlist.title}</h1>
        <TrackList tracks={playlist.tracks || []}
                    keyAttr={"id"}
                    onClickHandler={(track) => requestQueueTrack(track.id)} />
      </div>
    );
  }
}

function mapState(state) {
  const currentPlaylist = state.library.playlists.find((playlist) => {
    return playlist.id === state.views.playlist ? playlist : false;
  });

  return {
    playlist: currentPlaylist,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: {
      library: bindActionCreators(LibraryActions, dispatch),
    },
  };
}

export default connect(mapState, mapDispatch)(Playlist);


