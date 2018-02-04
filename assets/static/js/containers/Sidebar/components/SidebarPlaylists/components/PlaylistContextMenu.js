import React from 'react';
import PropTypes from 'prop-types';

import ContextMenu, { MenuItem } from 'Components/ContextMenu';

const PlaylistContextMenu = ({
  playlist, playPlaylist, queuePlaylist, hideContextMenu, position, validTarget,
}) => (
  <ContextMenu
    hideContextMenu={hideContextMenu}
    context={position}
    validTarget={validTarget}
  >
    <MenuItem onClick={() => playPlaylist(playlist.id)}>
      Play Playlist Now
    </MenuItem>
    <MenuItem onClick={() => queuePlaylist(playlist.id)}>
      Add Playlist to Queue
    </MenuItem>
  </ContextMenu>
);

PlaylistContextMenu.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  playPlaylist: PropTypes.func.isRequired,
  queuePlaylist: PropTypes.func.isRequired,
  hideContextMenu: PropTypes.func.isRequired,
  validTarget: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export default PlaylistContextMenu;
