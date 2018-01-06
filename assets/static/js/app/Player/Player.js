import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PlayerActions from './actions';

import SeekSlider from './SeekSlider';

class Player extends PureComponent {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    playing: PropTypes.bool.isRequired,
    currentTrack: PropTypes.shape({
      id: PropTypes.number,
      artist: PropTypes.string,
      title: PropTypes.string,
      album: PropTypes.string,
    }),
    startTime: PropTypes.number,
    pausedDuration: PropTypes.number,
  };

  static defaultProps = {
    currentTrack: null,
    startTime: null,
    pausedDuration: null,
  }

  constructor() {
    super();
    this.requestPlayback = this.requestPlayback.bind(this);
  }

  requestPlayback() {
    this.props.actions.requestPlayback(!this.props.playing);
  }

  render() {
    const { actions, playing, currentTrack, startTime, pausedDuration } = this.props;

    const playingClass = playing ? 'fa fa-pause' : 'fa fa-play';

    let playerCenter = '';
    if (currentTrack) {
      const artist = currentTrack.artist ? `${currentTrack.artist} - ` : '';
      const title = currentTrack.title ? currentTrack.title : currentTrack.filename;
      playerCenter = (
        <div className="player-center">
          <div className="song">
            {artist} {title}
          </div>
          <div className="album">
            {currentTrack.album}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="now-playing">
          <div id="player-controls">
            <i className="fa fa-fast-backward"onClick={actions.requestPreviousTrack}></i>
            <i className={playingClass} onClick={this.requestPlayback}></i>
            <i className="fa fa-fast-forward"onClick={actions.requestNextTrack}></i>
          </div>
          <div className="player-info">
            <div className="player-left-wrapper"></div>

            {playerCenter}

            <div className="player-right-wrapper">
            </div>
          </div>
        </div>
        <SeekSlider
          seek={this.props.actions.requestSeek}
          playing={playing}
          startTime={startTime}
          pausedDuration={pausedDuration}
          duration={currentTrack && currentTrack.duration}
        />
      </div>
    );
  }
}

function mapState(state) {
  return {
    playing: state.player.playing,
    currentTrack: state.player.currentTrack,
    startTime: state.player.startTime,
    pausedDuration: state.player.pausedDuration,
    queue: state.player.queue,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(PlayerActions, dispatch),
  };
}

export default connect(mapState, mapDispatch)(Player);
