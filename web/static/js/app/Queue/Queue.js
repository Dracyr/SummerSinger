import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PlayerActions from '../Player/actions';
import TrackList from '../../components/TrackList';

class Queue extends Component {
  render() {
    const { currentIndex, queue, actions } = this.props;

    return (
      <TrackList tracks={queue}
        keyAttr={"index"}
        currentKey={currentIndex}
        onClickHandler={(track) => actions.player.requestPlayTrack(track.index)}/>
    );
  }
}

function mapState(state) {
  return {
    currentIndex: state.player.currentTrack ? state.player.currentTrack.index : '',
    queue: state.player.queue,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: {
      player: bindActionCreators(PlayerActions, dispatch),
    },
  };
}

export default connect(mapState, mapDispatch)(Queue);
