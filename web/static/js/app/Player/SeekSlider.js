import React, { PureComponent, PropTypes } from 'react';

export default class SeekSlider extends PureComponent {
  static propTypes = {
    playing: PropTypes.bool,
    startTime: PropTypes.number,
    pausedDuration: PropTypes.number,
    duration: PropTypes.number,
    seek: PropTypes.func.isRequired,
  };

  static defaultProps = {
    playing: false,
    pausedDuration: 0,
    startTime: 0,
    duration: 0,
  };

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
      lastPlaying: this.props.playing ? Date.now() : this.state.lastPlaying,
    });
  }

  handleSeek(event) {
    this.props.seek(event.clientX / document.documentElement.clientWidth);
  }

  render() {
    const { playing, startTime, pausedDuration, duration } = this.props;
    let durationPercent = 0;
    if (startTime && duration) {
      if (playing) {
        durationPercent = (this.state.now - startTime) / (duration * 1000);
      } else {
        durationPercent = pausedDuration / (duration * 1000);
      }
    }

    return (
      <div className="seek-slider" onClick={this.handleSeek}>
        <span className="seek-slider-handle" />
        <span
          className="duration-passed"
          style={{ transform: `scaleX(${durationPercent})` }}
        />
      </div>
    );
  }
}
