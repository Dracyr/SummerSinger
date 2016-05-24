import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { requestVolume } from '../Player/actions';

class Settings extends Component {
  constructor() {
    super();
    this.setVolume = this.setVolume.bind(this);
  }

  setVolume(event) {
    const volume = event.target.value;
    this.props.actions.requestVolume(volume);
  }

  render() {
    return (
      <div>
        <h1>Settings</h1>
        <h4>Volume</h4>
        <input
          type="range"
          min="0"
          max="100"
          value={this.props.volume}
          onChange={this.setVolume}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  actions: PropTypes.object,
  volume: PropTypes.number,
};

function mapState(state) {
  return {
    volume: state.player.volume,
  };
}

function mapDispatch(dispatch) {
  return {
    actions: {
      requestVolume: (...args) => { dispatch(requestVolume(...args)); },
    },
  };
}

export default connect(mapState, mapDispatch)(Settings);

