import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchLibrary } from "Containers/Library/actions";
import ArtistList from "Containers/Artists/components/ArtistList";

class Artists extends PureComponent {
  static propTypes = {
    fetchLibrary: PropTypes.func.isRequired,
    artists: PropTypes.array.isRequired,
    totalArtists: PropTypes.number.isRequired
  };

  componentDidMount() {
    this.props.fetchLibrary("artists", 0, 50);
  }

  render() {
    const { artists, totalArtists, fetchLibrary } = this.props;

    return (
      <div>
        <h1 className="header">All Artists</h1>
        <ArtistList
          entries={artists}
          totalArtists={totalArtists}
          keyAttr="id"
          loadMoreRows={(offset, size) => fetchLibrary("artists", offset, size)}
        />
      </div>
    );
  }
}

function mapState(state) {
  return {
    artists: state.library.artists,
    totalArtists: state.library.totalArtists
  };
}

function mapDispatch(dispatch) {
  return {
    fetchLibrary: (...args) => dispatch(fetchLibrary(...args))
  };
}

export default connect(mapState, mapDispatch)(Artists);
