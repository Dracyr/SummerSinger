import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContextMenu, { MenuItem } from '../Util/ContextMenu';

export default class SidebarContextMenu extends Component {
  constructor() {
    super();
    this.playPlaylist = this.playPlaylist.bind(this);
    this.queuePlaylist = this.queuePlaylist.bind(this);
  }

  playPlaylist() {
    const playlist = this.props.playlist;
    this.props.playPlaylist(playlist);
  }

  queuePlaylist() {
    const playlist = this.props.playlist;
    this.props.queuePlaylist(playlist);
  }

  render() {
    /* <MenuItem onClick={this.deletePlaylist}>Delete Playlist</MenuItem> */
    return (
      <ContextMenu
        hideContextMenu={this.props.hideContextMenu}
        context={this.props.context}
      >
        <MenuItem onClick={this.playPlaylist}>Play Playlist Now</MenuItem>
        <MenuItem onClick={this.queuePlaylist}>Add Playlist to Queue</MenuItem>
      </ContextMenu>
    );
  }
}

SidebarContextMenu.propTypes = {
  playlist: PropTypes.object,
  playPlaylist: PropTypes.func,
  queuePlaylist: PropTypes.func,
  hideContextMenu: PropTypes.func,
  context: PropTypes.object,
};



