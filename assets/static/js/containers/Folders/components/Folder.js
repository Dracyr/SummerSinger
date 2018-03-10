import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class Folder extends PureComponent {
  static propTypes = {
    folder: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string
    }).isRequired,
    fetchFolder: PropTypes.func.isRequired,
    openContextMenu: PropTypes.func,
    style: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    openContextMenu: () => {}
  };

  onContextMenu = e => {
    e.preventDefault();
    this.props.openContextMenu(this.props.folder, e.pageX, e.pageY, "folder");
  };

  render() {
    return (
      <div
        className="tr track"
        onClick={() => this.props.fetchFolder(this.props.folder.id)}
        onContextMenu={this.onContextMenu}
        style={this.props.style}
      >
        <div className="td">
          <b>{this.props.folder.title}</b>
        </div>
      </div>
    );
  }
}
