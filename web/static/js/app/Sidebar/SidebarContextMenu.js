import React, { Component } from 'react';

import ContextMenu, { MenuItem } from '../../components/ContextMenu';

export default class SidebarContextMenu extends Component {
  constructor() {
    super();
    this.playPlaylist = this.playPlaylist.bind(this);
    this.queuePlaylist = this.queuePlaylist.bind(this);
  }

  playPlaylist() {
    const playlist = this.props.playlist;
    this.props.playPlaylist(playlist.id);
  }

  queuePlaylist() {
    const playlist = this.props.playlist;
    this.props.queuePlaylist(playlist.id);
  }

  render() {
    return (
      <ContextMenu
        hideContextMenu={this.props.hideContextMenu}
        context={this.props.context}
      >
        <MenuItem onClick={this.playPlaylist}>Play playlist</MenuItem>
        <MenuItem onClick={this.queuePlaylist}>Queue playlist</MenuItem>
      </ContextMenu>
    );
  }
}

SidebarContextMenu.propTypes = {
  playlist: React.PropTypes.object,
  playPlaylist: React.PropTypes.func,
  queuePlaylist: React.PropTypes.func,
  hideContextMenu: React.PropTypes.func,
  context: React.PropTypes.object,
};



