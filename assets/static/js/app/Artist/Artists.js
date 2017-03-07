import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchLibrary } from '../Library/actions';
import { InfiniteArtistList } from './ArtistList';

class Artists extends PureComponent {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    artists: PropTypes.array.isRequired,
    totalArtists: PropTypes.number.isRequired,
  };

  static defaultProps = {
    totalArtists: null,
  };

  componentDidMount() {
    this.props.fetch('artists', 0, 50);
  }

  render() {
    const { artists, totalArtists, fetch } = this.props;

    return (
      <div>
        <h1 className="header">All Artists</h1>

        <InfiniteArtistList
          entries={artists}
          totalArtists={totalArtists}
          keyAttr="id"
          loadMoreRows={(offset, size) => fetch('artists', offset, size)}
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
    fetch: (...args) => dispatch(fetchLibrary(...args)),
  };
}

export default connect(mapState, mapDispatch)(Artists);
