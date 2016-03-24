import React, { Component } from 'react';

export default class Settings extends Component {

  SetHwVolume(event) {
    // var hwVolume = event.target.value / 100;
    // Actions.setHwVolume(hwVolume);
  }

  render() {
    // var settings = this.props.settings;
    // var hwVolume   = settings.hwVolume * 100;
    const hwVolume = 100;

    return (
      <div>
        <h1>Settings</h1>
        <h4>Volume</h4>
        <input type="range" min="0" max="100" value={hwVolume} onChange={this.SetHwVolume}/>
      </div>
    );
  }
}
