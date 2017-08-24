import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { requestQueueAndPlayTrack } from '../Player/actions';
import { fetchLibrary, sortLibrary } from '../Library/actions';
import TrackList from '../Track/TrackList';

class Tracks extends PureComponent {
  static propTypes = {
    fetchLibrary: PropTypes.func.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    sortTracks: PropTypes.func.isRequired,
    currentId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    librarySort: PropTypes.object.isRequired,
    tracks: PropTypes.array.isRequired,
    totalTracks: PropTypes.number.isRequired,
  };

  componentDidMount() {
    this.props.fetchLibrary('tracks', 0, 50);
  }

  render() {
    const {
      tracks,
      currentId,
      totalTracks,
      librarySort,
      sortTracks,
      onClickHandler,
    } = this.props;

    return (
      <div>
        <h1 className="header">All Tracks</h1>

        <TrackList
          entries={tracks}
          totalTracks={totalTracks}
          keyAttr={'id'}
          currentKey={currentId}
          sortTracks={sortTracks}
          sort={librarySort}
          loadMoreRows={(offset, size) => this.props.fetchLibrary('tracks', offset, size)}
          onClickHandler={track => onClickHandler(track.id)}
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
    onClickHandler: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
    fetchLibrary: (...args) => dispatch(fetchLibrary(...args)),
    sortTracks: (...args) => dispatch(sortLibrary(...args)),
  };
}

export default connect(mapState, mapDispatch)(Tracks);
