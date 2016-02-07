import React, { Component } from 'react';
import { fetchLibrary, requestQueueTrack } from '../actionCreators';
import TrackList from './TrackList';

class Library extends Component {
  componentDidMount() {
    if (this.props.library.length === 0) {
      this.props.dispatch(fetchLibrary());
    }
  }

  render() {
    return (
      <TrackList tracks={this.props.library}
                  keyAttr={"id"}
                  onClickHandler={(track) => requestQueueTrack(track.id)} />
    );
  }
}

export default Library;
