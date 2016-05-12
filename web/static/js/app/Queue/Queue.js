import React, { Component } from 'react';
import { connect } from 'react-redux';

import { requestPlayTrack } from '../Player/actions';
import { removeQueueTrack } from './actions';
import TrackList from '../../components/TrackList';

class Queue extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClick(track) {
    this.props.actions.requestPlayTrack(track.index);
  }

  handleDelete(track) {
    this.props.actions.removeQueueTrack(track.index);
  }

  render() {
    const { currentIndex, queue } = this.props;

    return (
      <TrackList tracks={queue}
        keyAttr={"index"}
        currentKey={currentIndex}
        onClickHandler={this.handleClick}
        onDeleteHandler={this.handleDelete}
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
      requestPlayTrack: (...args) => { dispatch(requestPlayTrack(...args)); },
      removeQueueTrack: (...args) => { dispatch(removeQueueTrack(...args)); },
    },
  };
}

export default connect(mapState, mapDispatch)(Queue);
