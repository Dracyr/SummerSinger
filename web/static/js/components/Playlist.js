import React, { Component } from 'react';
import TrackList from '../components/TrackList';
import { requestQueueTrack } from '../actions/player';

export default class Playlist extends Component {
  componentDidMount() {
    const {playlist, fetchPlaylist} = this.props;
    fetchPlaylist(playlist.id);
  }

  render() {
    const { playlist } = this.props;

    return (
      <div>
        <h1>{playlist.title}</h1>
        <TrackList tracks={playlist.tracks || []}
                    keyAttr={"id"}
                    onClickHandler={(track) => requestQueueTrack(track.id)} />
      </div>
    );
  }
}
