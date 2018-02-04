import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import SidebarSearch from './components/SidebarSearch';
import SidebarPlaylists from './components/SidebarPlaylists';

import { fetchSearch as FetchSearch } from '../../app/Library/actions';
import * as PlaylistActions from '../../app/Playlist/actions';

const Sidebar = ({ fetchSearch, playlists, playlistActions }) => (
  <aside className="sidebar">
    <nav className="sidebar-links">
      <SidebarSearch search={fetchSearch} />

      <NavLink to="/queue" activeClassName="active">Queue</NavLink>
      <NavLink to="#" activeClassName="active">Library</NavLink>

      <ul className="sidebar-library-links">
        <li><NavLink to="/tracks" activeClassName="active">Tracks</NavLink></li>
        <li><NavLink to="/artists" activeClassName="active">Artists</NavLink></li>
        <li><NavLink to="/albums" activeClassName="active">Albums</NavLink></li>
        <li><NavLink to="/folders" activeClassName="active">Folders</NavLink></li>
      </ul>

      <NavLink to="/settings" activeClassName="active">Settings</NavLink>
    </nav>

    <SidebarPlaylists
      playlists={playlists}
      {...playlistActions}
    />
  </aside>
);

Sidebar.propTypes = {
  playlists: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  })).isRequired,
  playlistActions: PropTypes.objectOf(PropTypes.func).isRequired,
  fetchSearch: PropTypes.func.isRequired,
};

function mapState(state) {
  return {
    playlists: state.playlist.playlists,
  };
}

function mapDispatch(dispatch) {
  return {
    playlistActions: bindActionCreators(PlaylistActions, dispatch),
    fetchSearch: search => dispatch(FetchSearch(search)),
  };
}

export default withRouter(connect(mapState, mapDispatch)(Sidebar));
