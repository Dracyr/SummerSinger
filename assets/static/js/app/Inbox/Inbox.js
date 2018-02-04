import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';

import * as PlayerActions from 'Containers/Player/actions';
import * as InboxActions from './actions';

import TrackList from '../Track/TrackList';
import StarRating from '../Track/StarRating';

class Inbox extends PureComponent {
  static propTypes = {
    actions: PropTypes.object,
    tracks: PropTypes.array,
    currentId: PropTypes.number,
    totalTracks: PropTypes.number,
    inboxSort: PropTypes.object,
  };

  constructor() {
    super();
    this.loadMoreRows = _.throttle(this.loadMoreRows, 100, { leading: true, trailing: true });
    this.sortTracks = this.sortTracks.bind(this);
    this.clearInbox = this.clearInbox.bind(this);
    this.onSelectTrack = this.onSelectTrack.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchInbox(0, 50);
  }

  clearInbox() {
    this.props.actions.requestClearInbox();
  }

  sortTracks(sort) {
    this.props.actions.sortInbox(sort);
  }

  loadMoreRows(first, size) {
    this.props.actions.fetchInbox(first, size);
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
        <h1 className="header">
          Inbox
          <small className="header-controls">
            <span onClick={this.clearInbox}>add all to library</span>
          </small>
        </h1>
        <TrackList
          entries={tracks}
          totalTracks={totalTracks}
          keyAttr="id"
          currentKey={currentId}
          sortTracks={this.sortTracks}
          onSelectTrack={this.onSelectTrack}
          sort={inboxSort}
          loadMoreRows={(offset, size) => this.loadMoreRows(offset, size)}
          onClickHandler={track => actions.requestQueueAndPlayTrack(track.id)}
        />
      </div>
    );
  }
}

const TextInput = (props) => {
  return (
    <span className="input input--nao input--filled">
      <input
        className="input__field input__field--nao"
        type="text"
        value={props.value}
        onChange={props.onChange}
      />
      <label className="input__label input__label--nao">
        <span className="input__label-content input__label-content--nao">
          {props.name}
        </span>
      </label>
      <svg
        className="graphic graphic--nao"
        width="300%"
        height="100%"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
      >
        <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0" />
      </svg>
    </span>
  );
};

class TrackEditPane extends PureComponent {
  constructor() {
    super();
    this.state = {
      track: null,
      isOpened: false,
    };

    this.changeTitle = this.changeTitle.bind(this);
    this.changeArtist = this.changeArtist.bind(this);
    this.changeAlbum = this.changeAlbum.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      track: props.track,
      isOpened: props.track != null,
    });
  }

  changeTitle(event) {
    this.setState({
      track: { ...this.state.track, title: event.target.value },
    });
  }

  changeArtist(event) {
    this.setState({
      track: { ...this.state.track, artist: event.target.value },
    });
  }

  changeAlbum(event) {
    this.setState({
      track: { ...this.state.track, album: event.target.value },
    });
  }

  close() {
    this.props.closePortal();
  }

  render() {
    const track = this.state.track;

    return (
      <ReactCSSTransitionGroup
        transitionName="track-edit-pane"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        <div className={`track-edit-pane ${this.state.isOpened ? 'show-pane' : ''}`}>
          <div className="track-form">
            <TextInput
              name="Title"
              value={(track && track.title) || ''}
              onChange={this.changeTitle}
            />
            <TextInput
              name="Artist"
              value={(track && track.artist) || ''}
              onChange={this.changeArtist}
            />
            <TextInput
              name="Album"
              value={(track && track.album) || ''}
              onChange={this.changeAlbum}
            />
            <div className="track-form-rating">
              <StarRating rating={track && track.rating} />
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
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

export default connect(mapState, mapDispatch)(Inbox);
