import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ContextMenu, { MenuItem, SubMenu } from "Components/ContextMenu";
import { addTrackToPlaylist as AddTrackToPlaylist } from "Containers/Playlists/actions";
import { addTrackToLibrary as AddTrackToLibrary } from "Containers/Inbox/actions";
import {
  requestQueueTrack as RequestQueueTrack,
  requestQueueAndPlayTrack as RequestQueueAndPlayTrack
} from "Containers/Player/actions";

const TrackContextMenu = ({
  addTrackToLibrary,
  addTrackToPlaylist,
  requestQueueAndPlayTrack,
  requestQueueTrack,
  track,
  playlists,
  contextMenu,
  hideContextMenu
}) => (
  <ContextMenu hideContextMenu={hideContextMenu} context={contextMenu}>
    <MenuItem onClick={() => requestQueueAndPlayTrack(track.id)}>
      Play Track
    </MenuItem>
    <MenuItem onClick={() => requestQueueTrack(track.id)}>Queue Track</MenuItem>
    <SubMenu title="Add Track to Playlist">
      {playlists.map(playlist => (
        <MenuItem
          key={playlist.id}
          onClick={() => addTrackToPlaylist(track.id, playlist.id)}
        >
          {playlist.title}
        </MenuItem>
      ))}
    </SubMenu>
    {track && track.inbox ? (
      <MenuItem onClick={() => addTrackToLibrary(track.id)}>
        Add to Library
      </MenuItem>
    ) : (
      ""
    )}
  </ContextMenu>
);

TrackContextMenu.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.number,
    inbox: PropTypes.bool
  }).isRequired,
  addTrackToLibrary: PropTypes.func.isRequired,
  addTrackToPlaylist: PropTypes.func.isRequired,
  requestQueueAndPlayTrack: PropTypes.func.isRequired,
  requestQueueTrack: PropTypes.func.isRequired,
  hideContextMenu: PropTypes.func.isRequired,
  contextMenu: PropTypes.object.isRequired,
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string
    })
  ).isRequired
};

function mapState(state) {
  return {
    playlists: state.playlist.playlists
  };
}

function mapDispatch(dispatch) {
  return {
    addTrackToLibrary: (...args) => dispatch(AddTrackToLibrary(...args)),
    addTrackToPlaylist: (...args) => dispatch(AddTrackToPlaylist(...args)),
    requestQueueTrack: (...args) => dispatch(RequestQueueTrack(...args)),
    requestQueueAndPlayTrack: (...args) =>
      dispatch(RequestQueueAndPlayTrack(...args))
  };
}

export default connect(mapState, mapDispatch)(TrackContextMenu);
