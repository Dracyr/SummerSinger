import React, { Component } from 'react';
import TrackList from '../../components/TrackList';

const Playlist = (props) => {
  const { playlist, requestQueueAndPlayTrack } = props;

  return (
    <div>
      <h1>{playlist.title}</h1>
      <TrackList tracks={playlist.tracks || []}
        keyAttr={"id"}
        onClickHandler={(track) => requestQueueAndPlayTrack(track.id)}
      />
    </div>
  );
};

export default Playlist;
