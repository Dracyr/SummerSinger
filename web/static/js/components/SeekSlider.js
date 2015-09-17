import React, { Component } from 'react';

export default class SeekSlider extends Component {
  constructor(props) {
    super(props);
    this.state = { now: Date.now() };
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
    this.setState({now: Date.now()});
  }

  handleSeek(event) {
    this.props.seek(event.pageX / document.documentElement.clientWidth);
  }

  render() {
    const { playing, statusUpdate, track } = this.props;

    let durationPercent = 0;

    if (statusUpdate && track) {
      if (playing) {
        var now = this.state.now;
        var trackStartTime = new Date(statusUpdate.trackStartDate).getTime();

        var currentDuration = (now - trackStartTime) / 1000;
        durationPercent = currentDuration / track.duration;
      } else {
        durationPercent = statusUpdate.pausedTime / track.duration;
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
