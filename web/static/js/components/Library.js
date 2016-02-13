import React, { Component } from 'react';
import { requestQueueTrack } from '../actions/player';
import TrackList from './TrackList';

class Library extends Component {
  componentDidMount() {
    this.props.fetchLibraryTracks();
  }

  render() {
    const { library } = this.props;
    return (
      <TrackList tracks={library.tracks}
                  keyAttr={"id"}
                  onClickHandler={(track) => requestQueueTrack(track.id)} />
    );
  }
}

export default Library;
