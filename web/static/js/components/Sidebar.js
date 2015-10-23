import React, { Component } from 'react';

class SidebarPlaylist extends Component {
  render() {
    return (
      <li>{this.props.playlist.name}</li>
    );
  }
}

export default class Sidebar extends Component {
  isActive(view) {
    return this.props.view === view ? 'active' : '';
  }

  render() {
    let playlists = [
      {name: 'hej'},
      {name: 'asd'}
    ];

    const {switchView} = this.props;

    return (
      <div className="sidebar">
        <ul className="sidebar-links list-unstyled">
          <li onClick={() => switchView('NOW_PLAYING')}
              className={this.isActive('NOW_PLAYING')}>
                Now Playing
          </li>
          <li onClick={() => switchView('QUEUE')}
              className={this.isActive('QUEUE')}>
                Queues
          </li>
          <li onClick={() => switchView('LIBRARY')}
              className={this.isActive('LIBRARY')}>
                Library
          </li>
          <li onClick={() => switchView('SETTINGS')}
              className={this.isActive('SETTINGS')}>
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
              return (<SidebarPlaylist key={index} playlist={playlist}/>);
            })}
          </ul>
        </div>

        <div className="chat-tab hidden">

        </div>
      </div>
    );
  }
}