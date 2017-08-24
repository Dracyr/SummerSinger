import React, { PropTypes } from 'react';
import TrackList from '../Track/TrackList';

const Playlist = (props) => {
  const { playlist, currentId, requestQueueAndPlayTrack } = props;

  return (
    <div>
      <h1>{playlist.title}</h1>
      <TrackList
        entries={playlist.tracks || []}
        keyAttr="id"
        currentKey={currentId}
        onClickHandler={track => requestQueueAndPlayTrack(track.id)}
        displayStatic
      />
    </div>
  );
};

Playlist.propTypes = {
  playlist: PropTypes.shape({
    title: PropTypes.string,
    tracks: PropTypes.array,
  }).isRequired,
  currentId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  requestQueueAndPlayTrack: PropTypes.func.isRequired,
};

Playlist.defaultProps = {
  currentId: null,
};

export default Playlist;
