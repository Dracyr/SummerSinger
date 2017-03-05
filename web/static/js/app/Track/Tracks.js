import React, { Component } from 'react';
import { connect } from 'react-redux';

import { requestQueueAndPlayTrack } from '../Player/actions';
import { fetchLibrary, sortLibrary } from '../Library/actions';
import InfiniteTrackList from '../Track/InfiniteTrackList';

class Tracks extends Component {
  componentDidMount() {
    this.props.fetchLibrary('tracks', 0, 50);
  }

  render() {
    const {
      tracks,
      currentId,
      totalTracks,
      librarySort,
      fetchLibrary,
      sortLibrary,
      requestQueueAndPlayTrack,
    } = this.props;

    return (
      <div>
        <h1 className="header">All Tracks</h1>

        <InfiniteTrackList
          entries={tracks}
          totalTracks={totalTracks}
          keyAttr={'id'}
          currentKey={currentId}
          sortTracks={sortLibrary}
          sort={librarySort}
          loadMoreRows={(offset, size) => fetchLibrary('tracks', offset, size)}
          onClickHandler={track => requestQueueAndPlayTrack(track.id)}
        />
      </div>
    );
  }
}
function mapState(state) {
  return {
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
    librarySort: state.library.librarySort,
    tracks: state.library.tracks,
    totalTracks: state.library.totalTracks,
  };
}

function mapDispatch(dispatch) {
  return {
    requestQueueAndPlayTrack: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
    fetchLibrary: (...args) => dispatch(fetchLibrary(...args)),
    sortLibrary: (...args) => dispatch(sortLibrary(...args)),
  };
}

export default connect(mapState, mapDispatch)(Tracks);
