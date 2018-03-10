import React from "react";
import PropTypes from "prop-types";
import ContextMenu, { MenuItem } from "Components/ContextMenu";

const FolderContextMenu = ({
  folder,
  playFolder,
  queueFolder,
  context,
  hideContextMenu
}) => (
  <ContextMenu hideContextMenu={hideContextMenu} context={context}>
    <MenuItem onClick={() => playFolder(folder)} disabled>
      Play Folder
    </MenuItem>
    <MenuItem onClick={() => queueFolder(folder)}>Add Folder to Queue</MenuItem>
  </ContextMenu>
);

FolderContextMenu.propTypes = {
  folder: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  playFolder: PropTypes.func.isRequired,
  queueFolder: PropTypes.func.isRequired,
  hideContextMenu: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default FolderContextMenu;
