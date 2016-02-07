import React, { Component } from 'react';

export default class SeekSlider extends Component {
  constructor(props) {
    super(props);
    this.state = { now: Date.now(), lastPlaying: Date.now() };
    this.tick = this.tick.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 250);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({
      now: Date.now(),
      lastPlaying: this.props.playing ? Date.now() : this.state.lastPlaying
    });
  }

  handleSeek(event) {
    console.log(event.clientX / document.documentElement.clientWidth);
    this.props.seek(event.clientX / document.documentElement.clientWidth);
  }

  render() {
    const { playing, startTime, pausedDuration, track} = this.props;
    let durationPercent = 0;
    if (startTime && track) {
      if (playing) {
        let now = this.state.now;
        durationPercent = (now - startTime) / (track.duration * 1000);
      } else {
        durationPercent = pausedDuration / (track.duration * 1000);
      }
    }

    var durationStyle = {
      transform: 'scaleX(' + durationPercent + ')'
    };
    return (
      <div className="seek-slider" onClick={this.handleSeek}>
        <span className="seek-slider-handle"></span>
        <span className="duration-passed" style={durationStyle}></span>
      </div>
    );
  }
}
