import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchLibrary as FetchLibrary } from "Containers/Library/actions";
import AlbumList from "Containers/Albums/components/AlbumList";

class Albums extends Component {
  static propTypes = {
    fetchLibrary: PropTypes.func.isRequired,
    albums: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    totalAlbums: PropTypes.number.isRequired
  };

  componentDidMount() {
    this.props.fetchLibrary("albums", 0, 50);
  }

  render() {
    const { albums, totalAlbums, fetchLibrary } = this.props;

    return (
      <div>
        <h1 className="header">All Albums</h1>
        <AlbumList
          entries={albums}
          totalAlbums={totalAlbums}
          keyAttr="id"
          loadMoreRows={(offset, size) => fetchLibrary("albums", offset, size)}
        />
      </div>
    );
  }
}

function mapState(state) {
  return {
    albums: state.library.albums,
    totalAlbums: state.library.totalAlbums
  };
}

function mapDispatch(dispatch) {
  return {
    fetchLibrary: (...args) => dispatch(FetchLibrary(...args))
  };
}

export default connect(mapState, mapDispatch)(Albums);
