import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SidebarSearch from './SidebarSearch';
import SidebarPlaylist from './SidebarPlaylist';
import SidebarItem from './SidebarItem';

import * as LibraryActions from '../Library/actions';
import * as PlaylistActions from '../Playlist/actions';
import * as ViewsActions from '../../actions/views';

export default class Sidebar extends Component {
  constructor() {
    super();
    this.switchPlaylistViewCreate = this.switchPlaylistViewCreate.bind(this);
  }

  componentDidMount() {
    this.props.actions.playlist.fetchPlaylists();
  }

  isActive() {
    const { currentView, itemView } = this.props;
    return currentView === itemView ? 'active' : '';
  }

  switchPlaylistViewCreate() {
    this.props.actions.views.switchView('PLAYLIST');
    this.props.actions.playlist.switchPlaylistView('CREATE');
  }

  render() {
    const {
      playlists,
      currentPlaylist,
      view,
      search,
      actions
    } = this.props;
    const switchView = actions.views.switchView;
    const switchPlaylist = actions.views.switchPlaylist;
    const playlistViewActive = view === 'PLAYLIST';

    return (
      <div className="sidebar">
        <ul className="sidebar-links list-unstyled">
          <SidebarSearch switchView={switchView}
            active={view === 'SEARCH'}
            search={actions.library.fetchSearch}
          />
          <SidebarItem title="Now Playing" itemView="NOW_PLAYING"
            view={view} switchView={switchView} />
          <SidebarItem title="Queue" itemView="QUEUE"
            view={view} switchView={switchView} />
          <SidebarItem title="Library" itemView="LIBRARY"
            view={view} switchView={switchView} />
          <SidebarItem title="Setting" itemView="SETTINGS"
            view={view} switchView={switchView} />
        </ul>

        <div className="sidebar-playlist-header">
          Playlists
          <span className="fa fa-plus"
            onClick={this.switchPlaylistViewCreate}
          ></span>
        </div>

        <div className="playlist-tab">
          <ul className="playlist-list list-unstyled">
            {playlists.map(function(playlist, index) {
              return (
                <SidebarPlaylist key={index}
                  playlist={playlist}
                  currentPlaylist={currentPlaylist}
                  switchPlaylist={switchPlaylist}
                  playlistViewActive={playlistViewActive}
                />
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

function mapState(state) {
  const currentPlaylist = state.playlist.playlists.find((playlist) => {
    return playlist.id === state.views.playlist ? playlist : false;
  });

  return {
    view: state.views.view,
    playlists: state.playlist.playlists,
    currentPlaylist,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: {
      library: bindActionCreators(LibraryActions, dispatch),
      views: bindActionCreators(ViewsActions, dispatch),
      playlist: bindActionCreators(PlaylistActions, dispatch),
    },
  };
}

export default connect(mapState, mapDispatch)(Sidebar);



