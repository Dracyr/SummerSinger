import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TrackList from '../Track/TrackList';
import { requestQueueAndPlayTrack } from '../Player/actions';

const Search = props => (
  <TrackList
    entries={props.search}
    keyAttr={'id'}
    currentKey={props.currentId}
    onClickHandler={track => requestQueueAndPlayTrack(track.id)}
    renderList={({ entries, renderItem }) => (
      entries.map((track, index) => (
        renderItem({ index, key: track.id })
      ))
    )}
  />
);

Search.propTypes = {
  search: PropTypes.array.isRequired,
  currentId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

function mapState(state) {
  return {
    currentId: state.player.currentTrack ? state.player.currentTrack.id : '',
    search: state.library.search,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators([requestQueueAndPlayTrack], dispatch),
  };
}

export default connect(mapState, mapDispatch)(Search);
