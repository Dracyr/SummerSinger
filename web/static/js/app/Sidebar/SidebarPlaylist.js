import React, { Component } from 'react';

class SidebarPlaylist extends Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.switchPlaylist(this.props.playlist.id);
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
      <li className={active} onClick={this.onClick}>
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
};


export default SidebarPlaylist;
