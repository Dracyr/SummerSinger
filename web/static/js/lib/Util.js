import React, { Component } from 'react';

export class PlaceholderText extends Component {
  render() {
    const style = {
      width: '50%',
      height: '1em',
      display: 'inline-block',
      'backgroundColor': '#ddd'
    };
    return <div style={style}></div>;
  }
}
