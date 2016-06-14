import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dragula from 'react-dragula';

import SidebarSearch from './SidebarSearch';
import CreatePlaylist from './CreatePlaylist';
import SidebarPlaylist from './SidebarPlaylist';
import SidebarItem from './SidebarItem';
import SidebarContextMenu from './SidebarContextMenu';

import * as LibraryActions from '../Library/actions';
import * as PlaylistActions from '../Playlist/actions';
import * as ViewsActions from '../../actions/views';
import * as SidebarActions from './actions';

export default class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      contextMenu: null,
      selectedPlaylist: null,
    };
    this.toggleCreatePlaylist = this.toggleCreatePlaylist.bind(this);
    this.openContextMenu = this.openContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.queuePlaylist = this.queuePlaylist.bind(this);
  }

  componentDidMount() {
    this.props.actions.playlist.fetchPlaylists();
  }

  dragulaDecorator(componentBackingInstance) {
    if (componentBackingInstance) {
      const options = { };
      Dragula([componentBackingInstance], options);
    }
  }

  openContextMenu(playlist, x, y) {
    this.setState({
      contextMenu: { x, y },
      selectedPlaylist: playlist,
    });
  }

  hideContextMenu() {
    this.setState({
      contextMenu: null,
      selectedPlaylist: null,
    });
  }

  selectPlaylist(playlist) {
    this.setState({ selectedPlaylist: playlist });
  }

  playPlaylist(playlist) {
    this.props.actions.playlist.playPlaylist(playlist.id);
  }
  queuePlaylist(playlist) {
    this.props.actions.playlist.queuePlaylist(playlist.id);
  }

  isActive() {
    const { currentView, itemView } = this.props;
    return currentView === itemView ? 'active' : '';
  }

  toggleCreatePlaylist() {
    this.props.actions.sidebar.toggleCreatePlaylist();
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
    const openContextMenu = this.openContextMenu;
    const addTrackToPlaylist = actions.playlist.addTrackToPlaylist;

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
          <span className="fa fa-plus pull-right"
            onClick={this.toggleCreatePlaylist}
          ></span>
        </div>

        <div className="playlist-tab">
          <ul className="playlist-list list-unstyled">
            {this.props.showCreatePlaylist ?
              <CreatePlaylist submit={actions.playlist.createPlaylist} /> : ''
            }
            <div ref={this.dragulaDecorator}>
            {playlists.map(function(playlist, index) {
              return (
                <SidebarPlaylist key={index}
                  playlist={playlist}
                  currentPlaylist={currentPlaylist}
                  switchPlaylist={switchPlaylist}
                  playlistViewActive={playlistViewActive}
                  addTrackToPlaylist={addTrackToPlaylist}
                  openContextMenu={openContextMenu}
                />
              );
            })}
            </div>
          </ul>
        </div>
        {this.state.contextMenu ?
          <SidebarContextMenu
            context={this.state.contextMenu}
            hideContextMenu={this.hideContextMenu}
            playPlaylist={this.playPlaylist}
            queuePlaylist={this.queuePlaylist}
            playlist={this.state.selectedPlaylist}
          /> : ''
        }
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
    showCreatePlaylist: state.sidebar.showCreatePlaylist,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: {
      library: bindActionCreators(LibraryActions, dispatch),
      views: bindActionCreators(ViewsActions, dispatch),
      playlist: bindActionCreators(PlaylistActions, dispatch),
      sidebar: bindActionCreators(SidebarActions, dispatch),
    },
  };
}

export default connect(mapState, mapDispatch)(Sidebar);



