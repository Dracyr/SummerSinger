import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PlayerActions from '../app/Player/actions';
import * as PlaylistActions from '../app/Playlist/actions';

import ContextMenu, { MenuItem, Submenu } from './ContextMenu';

class PlaylistItem extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.addTrackToPlaylist(this.props.playlist);
  }

  render() {
    return (
      <MenuItem onClick={this.handleClick}>
        {this.props.playlist.title}
      </MenuItem>
    );
  }
}

export default class TrackContextMenu extends Component {
  constructor() {
    super();
    this.playTrack = this.playTrack.bind(this);
    this.queueTrack = this.queueTrack.bind(this);
    this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
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

  render() {
    return (
      <ContextMenu
        hideContextMenu={this.props.hideContextMenu}
        context={this.props.context}
      >
        <MenuItem onClick={this.playTrack}>Play Track</MenuItem>
        <MenuItem onClick={this.queueTrack}>Queue Track</MenuItem>
        <Submenu title="Add Track to Playlist">
          {this.props.playlists.map((playlist, index) => {
            return (
              <PlaylistItem key={index}
                playlist={playlist}
                addTrackToPlaylist={this.addTrackToPlaylist}
              />
            );
          })}
        </Submenu>
      </ContextMenu>
    );
  }
}

TrackContextMenu.propTypes = {
  track: React.PropTypes.object,
  actions: React.PropTypes.object,
  hideContextMenu: React.PropTypes.func,
  context: React.PropTypes.object,
  playlists: React.PropTypes.array,
};

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
    },
  };
}

export default connect(mapState, mapDispatch)(TrackContextMenu);



