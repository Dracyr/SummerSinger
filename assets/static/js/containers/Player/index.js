import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as PlayerActions from "./actions";
import SeekSlider from "Containers/Player/components/SeekSlider";
import TrackInfo from "Containers/Player/components/TrackInfo";

class SidebarPlayer extends PureComponent {
  static propTypes = {
    playing: PropTypes.bool.isRequired,
    currentTrack: PropTypes.shape({
      id: PropTypes.number,
      artist: PropTypes.string,
      title: PropTypes.string,
      album: PropTypes.string
    }),
    startTime: PropTypes.number,
    pausedDuration: PropTypes.number,
    requestPlayback: PropTypes.func.isRequired,
    requestSeek: PropTypes.func.isRequired,
    requestPreviousTrack: PropTypes.func.isRequired,
    requestNextTrack: PropTypes.func.isRequired
  };

  static defaultProps = {
    currentTrack: null,
    startTime: null,
    pausedDuration: null
  };

  constructor() {
    super();
    this.requestPlayback = this.requestPlayback.bind(this);
  }

  requestPlayback() {
    this.props.requestPlayback(!this.props.playing);
  }

  render() {
    const { playing, currentTrack, startTime, pausedDuration } = this.props;

    return (
      <section id="player">
        <img
          src="http://placekitten.com/g/250/250"
          alt=""
          className="now-playing-art"
        />

        <TrackInfo {...currentTrack} />

        <SeekSlider
          seek={this.props.requestSeek}
          playing={playing}
          startTime={startTime}
          pausedDuration={pausedDuration}
          duration={currentTrack && currentTrack.duration}
        />

        <ul id="player-controls">
          <i
            className="fa fa-fast-backward"
            onClick={this.props.requestPreviousTrack}
          />
          <i
            className={playing ? "fa fa-pause" : "fa fa-play"}
            onClick={this.requestPlayback}
          />
          <i
            className="fa fa-fast-forward"
            onClick={this.props.requestNextTrack}
          />
        </ul>
      </section>
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
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapState, mapDispatch)(SidebarPlayer);
