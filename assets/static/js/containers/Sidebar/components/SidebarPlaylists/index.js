import React, { Component } from "react";
import PropTypes from "prop-types";

import CreatePlaylistInput from "./components/CreatePlaylistInput";
import SidebarPlaylist from "./components/SidebarPlaylist";
import PlaylistContextMenu from "./components/PlaylistContextMenu";

class SidebarPlaylists extends Component {
  constructor() {
    super();

    this.state = {
      contextMenuPosition: null,
      selectedPlaylist: null,
      showCreatePlaylist: false
    };
  }

  componentDidMount() {
    this.props.fetchPlaylists();
  }

  openContextMenu = (playlist, x, y) => {
    this.setState({
      contextMenuPosition: { x, y },
      selectedPlaylist: playlist
    });
  };

  hideContextMenu = () => {
    this.setState({
      contextMenuPosition: null,
      selectedPlaylist: null
    });
  };

  selectPlaylist = playlist => {
    this.setState({ selectedPlaylist: playlist });
  };

  createPlaylist = playlistTitle => {
    this.props.createPlaylist(playlistTitle);
    this.setState({ showCreatePlaylist: false });
  };

  render() {
    const { playlists } = this.props;

    return (
      <nav>
        <header className="sidebar-playlist-header">
          Playlists
          <button onClick={() => this.setState({ showCreatePlaylist: true })}>
            <i className="fa fa-plus pull-right" />
          </button>
        </header>

        {this.state.showCreatePlaylist && (
          <CreatePlaylistInput
            submit={this.createPlaylist}
            cancel={() => this.setState({ showCreatePlaylist: false })}
          />
        )}

        <ul className="playlist-tab">
          {playlists.map(playlist => (
            <SidebarPlaylist
              key={playlist.id}
              playlist={playlist}
              addTrackToPlaylist={this.props.addTrackToPlaylist}
              openContextMenu={this.openContextMenu}
            />
          ))}
        </ul>

        {this.state.contextMenuPosition && (
          <PlaylistContextMenu
            validTarget={target =>
              target.classList.contains("sidebar-playlist")
            }
            position={this.state.contextMenuPosition}
            hideContextMenu={this.hideContextMenu}
            playPlaylist={this.props.playPlaylist}
            queuePlaylist={this.props.queuePlaylist}
            playlist={this.state.selectedPlaylist}
          />
        )}
      </nav>
    );
  }
}

SidebarPlaylists.propTypes = {
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string
    })
  ).isRequired,
  playPlaylist: PropTypes.func.isRequired,
  queuePlaylist: PropTypes.func.isRequired,
  addTrackToPlaylist: PropTypes.func.isRequired,
  createPlaylist: PropTypes.func.isRequired
};

export default SidebarPlaylists;
