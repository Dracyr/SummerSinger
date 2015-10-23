import React from 'react';
import SeekSlider from './SeekSlider';

export default class Player extends React.Component {

  render() {
    const { actions, playing, track } = this.props;

    var playingClass = playing ? 'fa fa-pause' : 'fa fa-play';

    let playerCenter = '';
    if (track) {
      playerCenter = (
        <div className='player-center'>
          <div className='song'>
            {track.artist} - {track.title}
          </div>
          <div className='album'>
            {track.album}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className='now-playing'>
          <div id='player-controls'>
            <i className='fa fa-fast-backward'></i>
            <i className={playingClass}
                onClick={() => actions.requestPlayback(!playing) }></i>
            <i className='fa fa-fast-forward'></i>
          </div>
          <div className='player-info'>
            <div className='player-left-wrapper'></div>

            {playerCenter}

            <div className='player-right-wrapper'>
            </div>
          </div>
        </div>
        <SeekSlider seek={this.props.actions.seek}
                    playing={playing}
                    track={track} />
      </div>
    );
  }
}
