import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { requestQueueAndPlayTrack } from "Containers/Player/actions";
import { fetchLibrary, sortLibrary } from "Containers/Library/actions";
import TrackList from "Components/TrackList";

class Tracks extends PureComponent {
  static propTypes = {
    fetchLibrary: PropTypes.func.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    sortTracks: PropTypes.func.isRequired,
    currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    librarySort: PropTypes.object.isRequired,
    tracks: PropTypes.array.isRequired,
    totalTracks: PropTypes.number.isRequired
  };

  componentDidMount() {
    this.props.fetchLibrary("tracks", 0, 50);
  }

  render() {
    const {
      tracks,
      currentId,
      totalTracks,
      librarySort,
      sortTracks,
      onClickHandler
    } = this.props;

    return (
      <div>
        <h1 className="header">All Tracks</h1>

        <TrackList
          entries={tracks}
          trackIds={this.props.trackIds}
          tracksById={this.props.tracksById}
          totalTracks={totalTracks}
          keyAttr={"id"}
          currentKey={currentId}
          sortTracks={sortTracks}
          sort={librarySort}
          loadMoreRows={(offset, size) =>
            this.props.fetchLibrary("tracks", offset, size)
          }
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
    trackIds: state.library.trackIds,
    tracksById: state.library.tracksById,
    totalTracks: state.library.totalTracks
  };
}

function mapDispatch(dispatch) {
  return {
    onClickHandler: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
    fetchLibrary: (...args) => dispatch(fetchLibrary(...args)),
    sortTracks: (...args) => dispatch(sortLibrary(...args))
  };
}

export default connect(mapState, mapDispatch)(Tracks);
