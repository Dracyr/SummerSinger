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
    this.props.playFolder(folder.id);
  }

  queueFolder() {
    const folder = this.props.folder;
    this.props.queueFolder(folder.id);
  }

  render() {
    return (
      <ContextMenu
        hideContextMenu={this.props.hideContextMenu}
        context={this.props.context}
      >
        <MenuItem onClick={this.playFolder}>Play Folder</MenuItem>
        <MenuItem onClick={this.queueFolder}>Queue Folder</MenuItem>
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



