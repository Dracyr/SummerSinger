import React, { Component, PropTypes } from 'react';

class SidebarPlaylist extends Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
  }

  onClick() {
    this.props.switchPlaylist(this.props.playlist.id);
  }

  onContextMenu(e) {
    e.preventDefault();
    this.props.openContextMenu(this.props.playlist, e.pageX, e.pageY);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    const payload = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (payload.track_id) {
      this.props.addTrackToPlaylist(payload.track_id, this.props.playlist.id);
    }
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
      <li
        className={active}
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        {playlist.title}
      </li>
    );
  }
}

SidebarPlaylist.propTypes = {
  playlist: PropTypes.object,
  switchPlaylist: PropTypes.func,
  currentPlaylist: PropTypes.object,
  playlistViewActive: PropTypes.bool,
  openContextMenu: PropTypes.func,
  addTrackToPlaylist: PropTypes.func,
};


export default SidebarPlaylist;
