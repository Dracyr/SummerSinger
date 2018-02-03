import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

class SidebarPlaylist extends PureComponent {
  static propTypes = {
    playlist: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }).isRequired,
    openContextMenu: PropTypes.func.isRequired,
    addTrackToPlaylist: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.state = {
      dragging: false,
    };
  }

  onContextMenu(e) {
    e.preventDefault();
    this.props.openContextMenu(this.props.playlist, e.pageX, e.pageY);
  }

  onDragOver(e) {
    e.preventDefault();
    this.setState({ dragging: true });
  }

  onDragLeave(e) {
    e.preventDefault();
    this.setState({ dragging: false });
  }

  onDrop(e) {
    const payload = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (payload.track_id) {
      this.props.addTrackToPlaylist(payload.track_id, this.props.playlist.id);
    }
  }

  render() {
    const { playlist } = this.props;

    return (
      <NavLink
        to={`/playlist/${playlist.id}`}
        activeClassName="active"
        onContextMenu={this.onContextMenu}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragLeave}
        onDragExit={this.onDragLeave}
        className={this.state.dragging ? 'dragging' : ''}
      >
        {playlist.title}
      </NavLink>
    );
  }
}

export default SidebarPlaylist;
