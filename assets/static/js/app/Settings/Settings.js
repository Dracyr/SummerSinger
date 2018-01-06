import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestVolume } from '../Player/actions';
import LibrarySettings from './Library/LibrarySettings';

class Settings extends PureComponent {
  static propTypes = {
    requestVolume: PropTypes.func.isRequired,
    volume: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    this.setVolume = this.setVolume.bind(this);
  }

  setVolume(event) {
    const volume = event.target.value;
    this.props.requestVolume(volume);
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

        <LibrarySettings />
      </div>
    );
  }
}

function mapState(state) {
  return {
    volume: state.player.volume,
  };
}

function mapDispatch(dispatch) {
  return {
    requestVolume: (...args) => { dispatch(requestVolume(...args)); },
  };
}

export default connect(mapState, mapDispatch)(Settings);

