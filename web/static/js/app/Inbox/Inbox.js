import React, { Component } from 'react';
import Portal from 'react-portal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PlayerActions from '../Player/actions';
import * as InboxActions from './actions';
import _ from 'lodash';

import TrackList from '../Track/TrackList';

class Inbox extends Component {
  constructor() {
    super();
    this.loadMoreRows = _.throttle(this.loadMoreRows, 100);
    this.sortTracks = this.sortTracks.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchInbox(0, 50);
  }

  loadMoreRows(from, size) {
    this.props.actions.fetchInbox(from, size);
  }

  sortTracks(sort) {
    this.props.actions.sortInbox(sort);
  }

  render() {
    const {
      tracks,
      currentId,
      totalTracks,
      inboxSort,
      actions,
    } = this.props;

    return (
      <div>
        <h1 className="header"> Inbox </h1>
        <TrackList
          tracks={tracks}
          totalTracks={totalTracks}
          keyAttr={"id"}
          currentKey={currentId}
          sortTracks={this.sortTracks}
          sort={inboxSort}
          loadMoreRows={(offset, size) => this.loadMoreRows(offset, size)}
          onClickHandler={(track) => actions.requestQueueAndPlayTrack(track.id)}
        />
        <Portal closeOnEsc>
          <TrackEditPane />
        </Portal>
      </div>
    );
  }
}

class TrackEditPane extends React.Component {
  render() {
    return (
      <div className="track-edit-pane">
        tjosan
        {this.props.children}
        <p><button onClick={this.props.closePortal}>Close this</button></p>
      </div>
    );
  }

}

function mapState(state) {
  return {
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
    inboxSort: state.inbox.inboxSort,
    tracks: state.inbox.tracks,
    totalTracks: state.inbox.totalTracks,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, InboxActions, PlayerActions), dispatch),
  };
}

Inbox.propTypes = {
  actions: React.PropTypes.object,
  tracks: React.PropTypes.array,
  currentId: React.PropTypes.number,
  totalTracks: React.PropTypes.number,
  inboxSort: React.PropTypes.object,
};


export default connect(mapState, mapDispatch)(Inbox);
