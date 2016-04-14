import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PlayerActions from '../Player/actions';
import TrackList from '../../components/TrackList';

class Queue extends Component {
  handleClick(track) {
    this.props.actions.player.requestPlayTrack(track.index);
  }

  render() {
    const { currentIndex, queue } = this.props;
    const handleClick = this.handleClick.bind(this);

    return (
      <TrackList tracks={queue}
        keyAttr={"index"}
        currentKey={currentIndex}
        onClickHandler={handleClick}
      />
    );
  }
}

Queue.propTypes = {
  actions: React.PropTypes.object,
  queue: React.PropTypes.array,
  currentIndex: React.PropTypes.number,
};

function mapState(state) {
  return {
    currentIndex: state.player.currentTrack ? state.player.currentTrack.index : null,
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
