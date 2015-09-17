import React, { Component } from 'react';

export default class Settings extends Component {

  setHwPlayback() {
    // Actions.setHwPlayback(!this.props.settings.hwPlayback);
  }

  SetHwVolume(event) {
    var hwVolume = event.target.value / 100;
    // Actions.setHwVolume(hwVolume);
  }

  render() {
    var settings = this.props.settings;
    var hwPlayback = settings.hwPlayback ? 'On' : 'Off';
    var hwVolume   = settings.hwVolume * 100;

    return (
      <div>
        <h1>Settings</h1>
        <h2>Hardware</h2>

        <h4>Volume</h4>
        <input type="range" min="0" max="100" value={hwVolume} onChange={this.SetHwVolume}/>

        <h4>Playback</h4>
        <button onClick={this.setHwPlayback}>
          Hardware Playback {hwPlayback}
        </button>
      </div>
    );
  }
}
