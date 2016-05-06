import React, { Component } from 'react';

import ContextMenu, { MenuItem } from '../../components/ContextMenu';

export default class FolderContextMenu extends Component {
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

FolderContextMenu.propTypes = {
  folder: React.PropTypes.object,
  playFolder: React.PropTypes.func,
  queueFolder: React.PropTypes.func,
  hideContextMenu: React.PropTypes.func,
  context: React.PropTypes.object,
};



