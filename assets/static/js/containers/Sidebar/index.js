import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import SidebarSearch from './components/SidebarSearch';
import CreatePlaylistInput from './components/CreatePlaylistInput';
import SidebarPlaylist from './components/SidebarPlaylist';
import SidebarContextMenu from './components/SidebarContextMenu';

import { fetchSearch } from '../../app/Library/actions';
import {
  fetchPlaylists,
  playPlaylist,
  queuePlaylist,
  addTrackToPlaylist,
  createPlaylist,
} from '../../app/Playlist/actions';

class Sidebar extends Component {
  constructor() {
    super();

    this.state = {
      contextMenuPosition: null,
      selectedPlaylist: null,
      showCreatePlaylist: false,
    };
  }

  componentDidMount() {
    this.props.fetchPlaylists();
  }

  openContextMenu = (playlist, x, y) => {
    this.setState({
      contextMenuPosition: { x, y },
      selectedPlaylist: playlist,
    });
  }

  hideContextMenu = () => {
    this.setState({
      contextMenuPosition: null,
      selectedPlaylist: null,
    });
  }

  selectPlaylist = (playlist) => {
    this.setState({ selectedPlaylist: playlist });
  }

  createPlaylist = (playlistTitle) => {
    this.props.createPlaylist(playlistTitle);
    this.setState({ showCreatePlaylist: false });
  }

  render() {
    const { playlists } = this.props;

    return (
      <aside className="sidebar">
        <nav className="sidebar-links">
          <SidebarSearch search={this.props.fetchSearch} />

          <NavLink to="/queue" activeClassName="active">Queue</NavLink>
          <NavLink to="/library" activeClassName="active">Library</NavLink>

          <ul className="sidebar-library-links">
            <li><NavLink to="/tracks" activeClassName="active">Tracks</NavLink></li>
            <li><NavLink to="/artists" activeClassName="active">Artists</NavLink></li>
            <li><NavLink to="/albums" activeClassName="active">Albums</NavLink></li>
            <li><NavLink to="/folders" activeClassName="active">Folders</NavLink></li>
          </ul>

          <NavLink to="/settings" activeClassName="active">Settings</NavLink>
        </nav>

        <div className="sidebar-playlist-header">
          <h6>Playlists</h6>
          <button onClick={() => this.setState({ showCreatePlaylist: true })}>
            <i className="fa fa-plus pull-right" />
          </button>
        </div>

        <nav className="playlist-tab">
          <div className="playlist-list list-unstyled">
            {this.state.showCreatePlaylist && <CreatePlaylistInput submit={this.createPlaylist} /> }

            <div ref={this.dragulaDecorator}>
              {playlists.map(playlist => (
                <SidebarPlaylist
                  key={playlist.id}
                  playlist={playlist}
                  addTrackToPlaylist={this.props.addTrackToPlaylist}
                  openContextMenu={this.openContextMenu}
                />
              ))}
            </div>
          </div>
        </nav>

        {this.state.contextMenuPosition &&
          <SidebarContextMenu
            position={this.state.contextMenuPosition}
            hideContextMenu={this.hideContextMenu}
            playPlaylist={this.props.playPlaylist}
            queuePlaylist={this.props.queuePlaylist}
            playlist={this.state.selectedPlaylist}
          />
        }
      </aside>
    );
  }
}

Sidebar.propTypes = {
  playlists: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  })).isRequired,
  fetchPlaylists: PropTypes.func.isRequired,
  playPlaylist: PropTypes.func.isRequired,
  queuePlaylist: PropTypes.func.isRequired,
  fetchSearch: PropTypes.func.isRequired,
  addTrackToPlaylist: PropTypes.func.isRequired,
  createPlaylist: PropTypes.func.isRequired,
};

function mapState(state) {
  return {
    playlists: state.playlist.playlists,
  };
}

function mapDispatch(dispatch) {
  return {
    fetchPlaylists: () => dispatch(fetchPlaylists()),
    playPlaylist: playlistId => dispatch(playPlaylist(playlistId)),
    queuePlaylist: playlistId => dispatch(queuePlaylist(playlistId)),
    addTrackToPlaylist: playlistId => dispatch(addTrackToPlaylist(playlistId)),
    createPlaylist: playlistTitle => dispatch(createPlaylist(playlistTitle)),
    fetchSearch: search => dispatch(fetchSearch(search)),
  };
}

export default withRouter(connect(mapState, mapDispatch)(Sidebar));
