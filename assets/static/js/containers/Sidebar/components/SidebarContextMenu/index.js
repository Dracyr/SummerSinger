import React from 'react';
import PropTypes from 'prop-types';

import ContextMenu, { MenuItem } from '../../../../app/Util/ContextMenu';

const SidebarContextMenu = ({
  playlist, playPlaylist, queuePlaylist, hideContextMenu, position,
}) => (
  <ContextMenu
    hideContextMenu={hideContextMenu}
    context={position}
  >
    <MenuItem onClick={() => playPlaylist(playlist.id)}>
      Play Playlist Now
    </MenuItem>
    <MenuItem onClick={() => queuePlaylist(playlist.id)}>
      Add Playlist to Queue
    </MenuItem>
  </ContextMenu>
);

SidebarContextMenu.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  playPlaylist: PropTypes.func.isRequired,
  queuePlaylist: PropTypes.func.isRequired,
  hideContextMenu: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export default SidebarContextMenu;
