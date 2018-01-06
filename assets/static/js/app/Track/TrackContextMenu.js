import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PlayerActions from '../Player/actions';
import * as PlaylistActions from '../Playlist/actions';
import { addTrackToLibrary } from '../Inbox/actions';

import ContextMenu, { MenuItem, Submenu } from '../Util/ContextMenu';

class TrackContextMenu extends PureComponent {
  static propTypes = {
    track: React.PropTypes.shape({
      id: PropTypes.number,
      inbox: PropTypes.bool,
    }).isRequired,
    actions: React.PropTypes.object.isRequired,
    hideContextMenu: React.PropTypes.func.isRequired,
    context: React.PropTypes.object.isRequired,
    playlists: React.PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }).isRequired,
  };

  constructor() {
    super();
    this.playTrack = this.playTrack.bind(this);
    this.queueTrack = this.queueTrack.bind(this);
    this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
    this.addTrackToLibrary = this.addTrackToLibrary.bind(this);
  }

  playTrack() {
    const track = this.props.track;
    this.props.actions.player.requestQueueAndPlayTrack(track.id);
  }

  queueTrack() {
    const track = this.props.track;
    this.props.actions.player.requestQueueTrack(track.id);
  }

  addTrackToPlaylist(playlist) {
    this.props.actions.playlist.addTrackToPlaylist(this.props.track.id, playlist.id);
  }

  addTrackToLibrary() {
    this.props.actions.addTrackToLibrary(this.props.track.id);
  }

  render() {
    return (
      <ContextMenu
        hideContextMenu={this.props.hideContextMenu}
        context={this.props.context}
      >
        <MenuItem onClick={this.playTrack}>Play Track</MenuItem>
        <MenuItem onClick={this.queueTrack}>Queue Track</MenuItem>
        <Submenu title="Add Track to Playlist">
          {this.props.playlists.map(playlist => (
            <MenuItem
              key={playlist.id}
              onClick={() => this.addTrackToPlaylist(playlist)}
            >
              {playlist.title}
            </MenuItem>
          ))}
        </Submenu>
        {this.props.track && this.props.track.inbox ?
          <MenuItem onClick={this.addTrackToLibrary}>Add to Library</MenuItem> : ''
        }
      </ContextMenu>
    );
  }
}

function mapState(state) {
  return {
    playlists: state.playlist.playlists,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: {
      player: bindActionCreators(PlayerActions, dispatch),
      playlist: bindActionCreators(PlaylistActions, dispatch),
      addTrackToLibrary: (...args) => dispatch(addTrackToLibrary(...args)),
    },
  };
}

export default connect(mapState, mapDispatch)(TrackContextMenu);