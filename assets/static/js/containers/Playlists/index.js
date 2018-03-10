import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { requestQueueAndPlayTrack as RequestQueueAndPlayTrack } from "Containers/Player/actions";
import { fetchPlaylist } from "./actions";

import Playlist from "Containers/Playlists/components/Playlist";

class PlaylistView extends Component {
  static propTypes = {
    playlist: PropTypes.shape({
      id: PropTypes.number
    }),
    fetchPlaylist: PropTypes.func.isRequired,
    requestQueueAndPlayTrack: PropTypes.func.isRequired,
    currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  static defaultProps = {
    currentId: null,
    playlist: null
  };

  componentDidMount() {
    if (this.props.playlist) {
      this.props.fetchPlaylist(this.props.playlist.id);
    }
  }

  componentDidUpdate() {
    if (this.props.playlist) {
      this.props.fetchPlaylist(this.props.playlist.id);
    }
  }

  render() {
    const { playlist, currentId, requestQueueAndPlayTrack } = this.props;

    if (!playlist) {
      return null;
    }

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

  return {
    playlist: state.playlist.playlists.find(
      p => (p.id === playlistId ? p : false)
    ),
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null
  };
}

function mapDispatch(dispatch) {
  return {
    requestQueueAndPlayTrack: (...args) =>
      dispatch(RequestQueueAndPlayTrack(...args)),
    fetchPlaylist: (...args) => dispatch(fetchPlaylist(...args))
  };
}

export default connect(mapState, mapDispatch)(PlaylistView);
