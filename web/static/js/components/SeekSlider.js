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
    this.props.seek(event.pageX / document.documentElement.clientWidth);
  }

  render() {
    const { playing, startTime, pausedTime, track, duration } = this.props;

    let durationPercent = 0;

    if (startTime && track) {
      if (playing) {
        let now = this.state.now;
        let currentDuration = (now - startTime);
        durationPercent = currentDuration / duration;
      } else {
        let currentDuration = (pausedTime - startTime);
        durationPercent = currentDuration / duration;
      }
    }

    var divStyle = {
      transform: 'scaleX(' + durationPercent + ')'
    };
    return (
      <div className="seek-slider" onClick={this.handleSeek}>
        <span className="seek-slider-handle"></span>
        <span className="duration-passed" style={divStyle}></span>
      </div>
    );
  }
}
