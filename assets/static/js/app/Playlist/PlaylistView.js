import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestQueueAndPlayTrack } from '../Player/actions';
import { fetchPlaylist } from './actions';

import Playlist from './Playlist';

class PlaylistView extends PureComponent {
  static propTypes = {
    playlist: PropTypes.shape({
      id: PropTypes.number,
    }),
    fetchPlaylist: PropTypes.func.isRequired,
    requestQueueAndPlayTrack: PropTypes.func.isRequired,
    currentId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    currentId: null,
    playlist: null,
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
    const { playlist, currentId } = this.props;
    if (!playlist) { return null; }

    return (
      <Playlist
        playlist={playlist}
        currentId={currentId}
        requestQueueAndPlayTrack={this.props.requestQueueAndPlayTrack}
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
    requestQueueAndPlayTrack: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
    fetchPlaylist: (...args) => dispatch(fetchPlaylist(...args)),
  };
}

export default connect(mapState, mapDispatch)(PlaylistView);
