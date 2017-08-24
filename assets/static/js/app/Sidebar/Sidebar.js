import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dragula from 'react-dragula';
import { NavLink, withRouter } from 'react-router-dom';

import SidebarSearch from './SidebarSearch';
import CreatePlaylist from './CreatePlaylist';
import SidebarPlaylist from './SidebarPlaylist';
import SidebarContextMenu from './SidebarContextMenu';

import SidebarPlayer from '../Player/SidebarPlayer';

import * as LibraryActions from '../Library/actions';
import * as PlaylistActions from '../Playlist/actions';
import * as SidebarActions from './actions';

class Sidebar extends PureComponent {
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

  toggleCreatePlaylist() {
    this.props.actions.sidebar.toggleCreatePlaylist();
  }

  render() {
    const {
      playlists,
      actions,
    } = this.props;
    const openContextMenu = this.openContextMenu;
    const addTrackToPlaylist = actions.playlist.addTrackToPlaylist;

    return (
      <div className="sidebar">
        <SidebarPlayer />
        <div className="sidebar-links">
          <SidebarSearch search={actions.library.fetchSearch} />
          <NavLink to="/queue" activeClassName="active">Queue</NavLink>
          {/* <NavLink to="/inbox" activeClassName="active">Inbox</NavLink> */}
          <NavLink to="/library" activeClassName="active">Library</NavLink>
          <ul className="sidebar-library-links">
            <li><NavLink to="/tracks" activeClassName="active">Tracks</NavLink></li>
            <li><NavLink to="/artists" activeClassName="active">Artists</NavLink></li>
            <li><NavLink to="/albums" activeClassName="active">Albums</NavLink></li>
            <li><NavLink to="/folders" activeClassName="active">Folders</NavLink></li>
          </ul>
          <NavLink to="/settings" activeClassName="active">Settings</NavLink>
        </div>

        <div className="sidebar-playlist-header">
          Playlists
          <span onClick={this.toggleCreatePlaylist}>
            <i className="fa fa-plus pull-right" />
          </span>
        </div>

        <div className="playlist-tab">
          <div className="playlist-list list-unstyled">
            {this.props.showCreatePlaylist ?
              <CreatePlaylist submit={actions.playlist.createPlaylist} /> : ''
            }
            <div ref={this.dragulaDecorator}>
              {playlists.map(playlist => (
                <SidebarPlaylist
                  key={playlist.id}
                  playlist={playlist}
                  addTrackToPlaylist={addTrackToPlaylist}
                  openContextMenu={openContextMenu}
                />
              ))}
            </div>
          </div>
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

Sidebar.propTypes = {
  playlists: PropTypes.array,
  actions: PropTypes.object,
};


function mapState(state) {
  return {
    playlists: state.playlist.playlists,
    showCreatePlaylist: state.sidebar.showCreatePlaylist,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: {
      library: bindActionCreators(LibraryActions, dispatch),
      playlist: bindActionCreators(PlaylistActions, dispatch),
      sidebar: bindActionCreators(SidebarActions, dispatch),
    },
  };
}

export default withRouter(connect(mapState, mapDispatch)(Sidebar));
