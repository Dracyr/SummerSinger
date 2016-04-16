import React, { Component } from 'react';

class SidebarPlaylist extends Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
  }

  onClick() {
    this.props.switchPlaylist(this.props.playlist.id);
  }

  onContextMenu(e) {
    e.preventDefault();
    this.props.openContextMenu(this.props.playlist, e.pageX, e.pageY);
  }

  render() {
    const {
      playlist,
      currentPlaylist,
      playlistViewActive,
    } = this.props;

    const active = playlistViewActive && currentPlaylist &&
      currentPlaylist.id === playlist.id ? 'active' : '';

    return (
      <li className={active} onClick={this.onClick} onContextMenu={this.onContextMenu}>
        {playlist.title}
      </li>
    );
  }
}

SidebarPlaylist.propTypes = {
  playlist: React.PropTypes.object,
  switchPlaylist: React.PropTypes.func,
  currentPlaylist: React.PropTypes.object,
  playlistViewActive: React.PropTypes.bool,
  openContextMenu: React.PropTypes.func,
};


export default SidebarPlaylist;
