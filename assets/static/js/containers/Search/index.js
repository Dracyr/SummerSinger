import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { normalizeTracks } from "Util";
import { requestQueueAndPlayTrack as RequestQueueAndPlayTrack } from "Containers/Player/actions";
import TrackList from "Components/TrackList";

const Search = ({ search, currentId, requestQueueAndPlayTrack }) => (
  <Fragment>
    <h1 className="header">Search</h1>
    <TrackList
      keyAttr="id"
      trackIds={search.map(t => t.id)}
      tracksById={normalizeTracks(search)}
      currentKey={currentId}
      onClickHandler={track => requestQueueAndPlayTrack(track.id)}
      renderList={({ entries, renderItem }) =>
        entries.map((track, index) => renderItem({ index, key: track.id }))
      }
    />
  </Fragment>
);

Search.propTypes = {
  search: PropTypes.arrayOf({
    id: PropTypes.number
  }).isRequired,
  currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  requestQueueAndPlayTrack: PropTypes.func
};

Search.defaultProps = {
  currentId: null,
  requestQueueAndPlayTrack: () => {}
};

function mapState(state) {
  return {
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
    search: state.library.search
  };
}

function mapDispatch(dispatch) {
  return {
    requestQueueAndPlayTrack: (...args) =>
      dispatch(RequestQueueAndPlayTrack(...args))
  };
}

export default connect(mapState, mapDispatch)(Search);
