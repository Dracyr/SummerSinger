import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TrackList from '../../components/TrackList';
import { requestQueueTrack } from '../Player/actions';

export default class Search extends Component {
  render() {
    const { search, currentId } = this.props;

    return (
      <div>
        <TrackList
          tracks={search}
          keyAttr={"id"}
          currentKey={currentId}
          onClickHandler={(track) => requestQueueTrack(track.id)} />;
      </div>
    );
  }
}


function mapState(state) {
  return {
    currentId: state.player.currentTrack ? state.player.currentTrack.id : '',
    search: state.library.search,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators([requestQueueTrack], dispatch),
  };
}

export default connect(mapState, mapDispatch)(Search);
