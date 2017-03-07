import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchLibrary } from '../Library/actions';
import { InfiniteAlbumList } from './AlbumList';

class Albums extends PureComponent {
  static propTypes = {
    fetchLibrary: PropTypes.func.isRequired,
    albums: PropTypes.array.isRequired,
    totalAlbums: PropTypes.number.isRequired,
  };

  componentDidMount() {
    this.props.fetchLibrary('albums', 0, 50);
  }

  render() {
    const { albums, totalAlbums } = this.props;

    return (
      <div>
        <h1 className="header">All Albums</h1>
        <InfiniteAlbumList
          entries={albums}
          totalAlbums={totalAlbums}
          keyAttr="id"
          loadMoreRows={(offset, size) => this.props.fetchLibrary('albums', offset, size)}
        />
      </div>
    );
  }
}

function mapState(state) {
  return {
    albums: state.library.albums,
    totalAlbums: state.library.totalAlbums,
  };
}

function mapDispatch(dispatch) {
  return {
    fetchLibrary: (...args) => dispatch(fetchLibrary(...args)),
  };
}

export default connect(mapState, mapDispatch)(Albums);
