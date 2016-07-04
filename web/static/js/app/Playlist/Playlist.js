import React, { PropTypes } from 'react';
import TrackList from '../../components/TrackList';

const Playlist = (props) => {
  const { playlist, currentId, requestQueueAndPlayTrack } = props;

  return (
    <div>
      <h1>{playlist.title}</h1>
      <TrackList tracks={playlist.tracks || []}
        keyAttr={"id"}
        currentKey={currentId}
        onClickHandler={(track) => requestQueueAndPlayTrack(track.id)}
      />
    </div>
  );
};

Playlist.propTypes = {
  playlist: PropTypes.object,
  currentId: PropTypes.number.isRequired,
  requestQueueAndPlayTrack: PropTypes.func,
};

export default Playlist;
