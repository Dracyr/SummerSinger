import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TrackList from '../../components/TrackList';

import { requestQueueTrack } from '../Player/actions';
import * as PlaylistActions from './actions';

class Playlist extends Component {
  componentDidMount() {
    const { playlist, actions } = this.props;
    actions.fetchPlaylist(playlist.id);
  }

  componentDidUpdate() {
    const { playlist, actions } = this.props;
    actions.fetchPlaylist(playlist.id);
  }

  render() {
    const { playlist, requestQueueTrack } = this.props;

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
  const currentPlaylist = state.playlist.playlists.find((playlist) => {
    return playlist.id === state.views.playlist ? playlist : false;
  });

  return {
    playlist: currentPlaylist,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(PlaylistActions, dispatch),
    requestQueueTrack: (...args) => dispatch(requestQueueTrack(...args)),
  };
}

export default connect(mapState, mapDispatch)(Playlist);


