import React from "react";
import PropTypes from "prop-types";
import TrackList from "Components/TrackList";

const Playlist = ({ playlist, currentId, requestQueueAndPlayTrack }) => (
  <div>
    <h1>{playlist.title}</h1>
    <TrackList
      keyAttr="id"
      currentKey={currentId}
      trackIds={(playlist.tracks && playlist.tracks.map(p => p.id)) || []}
      tracksById={
        (playlist.tracks &&
          playlist.tracks.reduce((acc, t) => ({ ...acc, [t.id]: t }), {})) ||
        {}
      }
      totalTracks={playlist.tracks && playlist.tracks.length}
      onClickHandler={track => requestQueueAndPlayTrack(track.id)}
    />
  </div>
);

Playlist.propTypes = {
  playlist: PropTypes.shape({
    title: PropTypes.string,
    tracks: PropTypes.array
  }).isRequired,
  currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  requestQueueAndPlayTrack: PropTypes.func.isRequired
};

Playlist.defaultProps = {
  currentId: null
};

export default Playlist;
