import React from 'react';
import SeekSlider from './SeekSlider';

export default class Player extends React.Component {

  render() {
    const { actions, playing, streaming, track, statusUpdate } = this.props;

    var playingClass = playing ? 'fa fa-pause' : 'fa fa-play';
    var streamingClass = streaming ? 'fa fa-volume-up' : 'fa fa-volume-off';

    let playerCenter = '';
    if (track) {
      playerCenter = (
        <div className='player-center'>
          <div className='song'>
            {track.artistName} - {track.name}
          </div>
          <div className='album'>
            {track.albumName}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className='now-playing'>
          <div id='player-controls'>
            <i className='fa fa-fast-backward'></i>
            <i className={playingClass} onClick={() => actions.requestPlaying(!playing) }></i>
            <i className='fa fa-fast-forward'></i>
          </div>
          <div className='player-info'>
            <div className='player-left-wrapper'></div>

            {playerCenter}

            <div className='player-right-wrapper'>
              <div className='streaming-controls'>
                  <i className={streamingClass}
                      onClick={() => actions.setStreaming(!streaming)} ></i>
              </div>
            </div>
          </div>
        </div>
        <SeekSlider seek={this.props.actions.seek}
                    playing={playing}
                    statusUpdate={statusUpdate}
                    track={track} />
      </div>
    );
  }
}
