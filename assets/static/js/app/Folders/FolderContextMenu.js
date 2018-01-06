import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ContextMenu, { MenuItem } from '../Util/ContextMenu';

export default class FolderContextMenu extends PureComponent {
  static propTypes = {
    folder: PropTypes.object.isRequired,
    playFolder: PropTypes.func.isRequired,
    queueFolder: PropTypes.func.isRequired,
    hideContextMenu: PropTypes.func.isRequired,
    context: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.playFolder = this.playFolder.bind(this);
    this.queueFolder = this.queueFolder.bind(this);
  }

  playFolder() {
    const folder = this.props.folder;
    this.props.playFolder(folder);
  }

  queueFolder() {
    const folder = this.props.folder;
    this.props.queueFolder(folder);
  }

  render() {
    return (
      <ContextMenu
        hideContextMenu={this.props.hideContextMenu}
        context={this.props.context}
      >
        <MenuItem onClick={this.playFolder} disabled>Play Folder</MenuItem>
        <MenuItem onClick={this.queueFolder}>Add Folder to Queue</MenuItem>
      </ContextMenu>
    );
  }
}
