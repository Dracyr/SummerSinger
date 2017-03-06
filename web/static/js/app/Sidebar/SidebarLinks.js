import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';

import SidebarSearch from './SidebarSearch';

const SidebarLinks = props => (
  <div className="sidebar-links">
    <SidebarSearch search={props.fetchSearch} />
    <NavLink to="/queue" activeClassName="active">Queue</NavLink>
    <NavLink to="/inbox" activeClassName="active">Inbox</NavLink>
    {/* <NavLink to="/library" activeClassName="active">Library</NavLink> */}
    <NavLink to="/tracks" activeClassName="active">Tracks</NavLink>
    <NavLink to="/artists" activeClassName="active">Artists</NavLink>
    <NavLink to="/albums" activeClassName="active">Albums</NavLink>
    <NavLink to="/folders" activeClassName="active">Folders</NavLink>
    <NavLink to="/settings" activeClassName="active">Settings</NavLink>
  </div>
);

SidebarLinks.propTypes = {
  fetchSearch: PropTypes.func.isRequired,
};

export default SidebarLinks;
