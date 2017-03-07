import React, { PureComponent } from 'react';
import ContextMenu, { MenuItem } from '../Util/ContextMenu';

export default class FolderContextMenu extends PureComponent {
  static propTypes = {
    folder: React.PropTypes.object.isRequired,
    playFolder: React.PropTypes.func.isRequired,
    queueFolder: React.PropTypes.func.isRequired,
    hideContextMenu: React.PropTypes.func.isRequired,
    context: React.PropTypes.object.isRequired,
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
