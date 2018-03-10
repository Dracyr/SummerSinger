import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchLibrary } from "Containers/Library/actions";

class Tracks extends Component {
  componentDidMount() {
    this.props.fetchLibrary("tracks", 0, 500);
  }

  renderTrack = id => {
    const track = this.props.tracksById[id];

    return (
      <div className="next-tracks-track" key={track.id}>
        <div className="next-track-td next-track-title">{track.title}</div>
        <div className="next-track-td next-track-artist">{track.artist}</div>
        <div className="next-track-td next-track-album">{track.album}</div>
      </div>
    );
  };

  render() {
    return (
      <div className="next-tracks-list">
        {this.props.tracksIds.map(id => this.renderTrack(id))}
      </div>
    );
  }
}

Tracks.propTypes = {
  tracksById: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string
  }),
  tracksIds: PropTypes.arrayOf(PropTypes.number),
  fetchLibrary: PropTypes.func
};

Tracks.defaultProps = {
  tracksById: {},
  tracksIds: [],
  fetchLibrary: () => {}
};

function mapState(state) {
  return {
    tracksIds: state.library.trackIds,
    tracksById: state.library.tracksById,
    totalTracks: state.library.totalTracks
  };
}

function mapDispatch(dispatch) {
  return {
    fetchLibrary: (...args) => dispatch(fetchLibrary(...args))
  };
}

export default connect(mapState, mapDispatch)(Tracks);
