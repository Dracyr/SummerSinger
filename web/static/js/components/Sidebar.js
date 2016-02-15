import React, { Component } from 'react';

class SidebarPlaylist extends Component {
  render() {
    const {
      playlist,
      switchPlaylist,
      currentPlaylist,
      playlistView
    } = this.props;

    const active = playlistView && currentPlaylist && currentPlaylist.id === playlist.id ? 'active' : '';
    return (
      <li onClick={() => switchPlaylist(playlist.id)}
          className={active}>
        {playlist.title}
      </li>
    );
  }
}

export default class Sidebar extends Component {

  componentDidMount() {
    this.props.fetchPlaylists();
  }

  isActive(view, currentView) {
    return currentView === view ? 'active' : '';
  }

  render() {
    const {
      switchView,
      switchPlaylist,
      playlists,
      currentPlaylist,
      view
    } = this.props;
    let isActive = this.isActive;

    return (
      <div className="sidebar">
        <ul className="sidebar-links list-unstyled">
          <li onClick={() => switchView('NOW_PLAYING')}
              className={isActive('NOW_PLAYING', view)}>
                Now Playing
          </li>
          <li onClick={() => switchView('QUEUE')}
              className={isActive('QUEUE', view)}>
                Queue
          </li>
          <li onClick={() => switchView('LIBRARY')}
              className={isActive('LIBRARY', view)}>
                Library
          </li>
          <li onClick={() => switchView('SETTINGS')}
              className={isActive('SETTINGS', view)}>
                Settings
          </li>
        </ul>

        <div className="playlist-chat">
          <span className="playlists active">Playlists</span>
          <span className="divider">|</span>
          <span className="chat">Chat</span>
        </div>

        <div className="playlist-tab">
          <ul className="playlist-list list-unstyled">
            {playlists.map(function(playlist, index) {
              return (
                <SidebarPlaylist key={index}
                                playlist={playlist}
                                currentPlaylist={currentPlaylist}
                                switchPlaylist={switchPlaylist}
                                playlistView={isActive('PLAYLIST', view) === 'active'} />
              );
            })}
          </ul>
        </div>

        <div className="chat-tab hidden">

        </div>
      </div>
    );
  }
}
