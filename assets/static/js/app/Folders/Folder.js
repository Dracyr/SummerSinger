import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Folder extends PureComponent {
  static propTypes = {
    folder: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }).isRequired,
    fetchFolder: PropTypes.func.isRequired,
    openContextMenu: PropTypes.func,
    style: PropTypes.object,
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
        style={this.props.style}
      >
        <div className="td "><b>{this.props.folder.title}</b></div>
        <div className="td "></div>
        <div className="td "></div>
        <div className="td "></div>
      </div>
    );
  }
}
