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

class SidebarSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'Search'};
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({value: value});
    if (value.length >= 3) {
      this.search(value);
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.search(this.state.value);
    }
  }

  search(search_term) {
    this.props.search(search_term);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active !== prevProps.active) {
      const value = this.props.active ? '' : 'Search';
      this.setState({value: value});
    }
  }

  render() {
    const handleKeyPress = this.handleKeyPress.bind(this);
    const {switchView, active, searchTrack} = this.props;

    return (
      <li onClick={() => switchView('SEARCH')}
          className={active ? 'search active' : 'search'}>
        <input type="text"
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)} />
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
      view,
      search
    } = this.props;
    let isActive = this.isActive;

    return (
      <div className="sidebar">
        <ul className="sidebar-links list-unstyled">
          <SidebarSearch switchView={switchView} active={view === 'SEARCH'} search={search} />
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

        <div className="sidebar-playlist-header">
          Playlists
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
