import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchLibrary } from '../Library/actions';
import { InfiniteArtistList } from './ArtistList';

class Artists extends Component {
  componentDidMount() {
    this.props.fetchLibrary('artists', 0, 50);
  }

  render() {
    const { artists, totalArtists, fetchLibrary } = this.props;

    return (
      <div>
        <h1 className="header">All Artists</h1>

        <InfiniteArtistList
          entries={artists}
          totalArtists={totalArtists}
          keyAttr="id"
          loadMoreRows={(offset, size) => fetchLibrary('artists', offset, size)}
        />
      </div>
    );
  }
}

function mapState(state) {
  return {
    artists: state.library.artists,
    totalArtists: state.library.totalArtists,
  };
}

function mapDispatch(dispatch) {
  return {
    fetchLibrary: (...args) => dispatch(fetchLibrary(...args)),
  };
}

export default connect(mapState, mapDispatch)(Artists);
