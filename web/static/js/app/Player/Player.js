import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PlayerActions from './actions';

import SeekSlider from './SeekSlider';

class Player extends React.Component {

  render() {
    const { actions, playing, currentTrack, startTime, pausedDuration } = this.props;

    const playingClass = playing ? 'fa fa-pause' : 'fa fa-play';

    let playerCenter = '';
    if (currentTrack) {
      playerCenter = (
        <div className='player-center'>
          <div className='song'>
            {currentTrack.artist} - {currentTrack.title}
          </div>
          <div className='album'>
            {currentTrack.album}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className='now-playing'>
          <div id='player-controls'>
            <i className='fa fa-fast-backward'
               onClick={() => actions.requestPreviousTrack() }></i>
            <i className={playingClass}
               onClick={() => actions.requestPlayback(!playing) }></i>
            <i className='fa fa-fast-forward'
               onClick={() => actions.requestNextTrack() }></i>
          </div>
          <div className='player-info'>
            <div className='player-left-wrapper'></div>

            {playerCenter}

            <div className='player-right-wrapper'>
            </div>
          </div>
        </div>
        <SeekSlider seek={this.props.actions.requestSeek}
                    playing={playing}
                    startTime={startTime}
                    pausedDuration={pausedDuration}
                    track={currentTrack} />
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
    queue: state.player.queue
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(PlayerActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(Player);
