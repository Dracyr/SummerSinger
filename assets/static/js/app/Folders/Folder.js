import React, { PureComponent, PropTypes } from 'react';

export default class Folder extends PureComponent {
  static propTypes = {
    folder: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }).isRequired,
    fetchFolder: PropTypes.func.isRequired,
    openContextMenu: PropTypes.func,
  };

  static defaultProps = {
    openContextMenu: () => {},
  }

  constructor() {
    super();
    this.fetchFolder = this.fetchFolder.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
  }

  onContextMenu(e) {
    e.preventDefault();
    this.props.openContextMenu(this.props.folder, e.pageX, e.pageY, 'folder');
  }

  fetchFolder() {
    const { folder, fetchFolder } = this.props;
    fetchFolder(folder.id);
  }

  render() {
    return (
      <div
        className="tr track"
        onClick={this.fetchFolder}
        onContextMenu={this.onContextMenu}
      >
        <div className="td "><b>{this.props.folder.title}</b></div>
        <div className="td "></div>
        <div className="td "></div>
        <div className="td "></div>
      </div>
    );
  }
}
