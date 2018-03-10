import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

class SidebarPlaylist extends Component {
  static propTypes = {
    playlist: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string
    }).isRequired,
    openContextMenu: PropTypes.func.isRequired,
    addTrackToPlaylist: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = {
      dragging: false
    };
  }

  handleContextMenu = e => {
    e.preventDefault();
    this.props.openContextMenu(this.props.playlist, e.pageX, e.pageY);
  };

  handleDragOver = e => {
    e.preventDefault();
    this.setState({ dragging: true });
  };

  handleDragLeave = e => {
    e.preventDefault();
    this.setState({ dragging: false });
  };

  handleDrop = e => {
    const payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (payload.track_id) {
      this.props.addTrackToPlaylist(payload.track_id, this.props.playlist.id);
    }
  };

  render() {
    const { playlist } = this.props;

    return (
      <NavLink
        to={`/playlist/${playlist.id}`}
        activeClassName="active"
        onContextMenu={this.handleContextMenu}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragLeave={this.handleDragLeave}
        onDragEnd={this.handleDragLeave}
        onDragExit={this.handleDragLeave}
        className={`sidebar-playlist ${this.state.dragging ? "dragging" : ""}`}
      >
        {playlist.title}
      </NavLink>
    );
  }
}

export default SidebarPlaylist;
