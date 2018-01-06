import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TrackList from '../Track/TrackList';
import { requestPlayTrack } from '../Player/actions';
import { removeQueueTrack, clearQueue } from './actions';

class Queue extends PureComponent {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
    currentIndex: PropTypes.number,
  };

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.clearQueue = this.clearQueue.bind(this);
  }

  handleClick(track) {
    this.props.actions.requestPlayTrack(track.index);
  }

  handleDelete(track) {
    this.props.actions.removeQueueTrack(track.index);
  }

  clearQueue() {
    this.props.actions.clearQueue();
  }

  render() {
    const { currentIndex, queue } = this.props;

    return (
      <div>
        <h1 className="header">
          Queue
          <small className="header-controls">
            <span onClick={this.clearQueue}>clear queue</span>
          </small>
        </h1>
        <TrackList
          entries={queue}
          keyAttr="index"
          currentKey={currentIndex}
          onClickHandler={this.handleClick}
          onDeleteHandler={this.handleDelete}
        />
      </div>
    );
  }
}

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
      clearQueue: (...args) => { dispatch(clearQueue(...args)); },
    },
  };
}

export default connect(mapState, mapDispatch)(Queue);
