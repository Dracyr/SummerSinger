import React, { Component } from 'react';

export default class CreatePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.refs.playlistInput.focus();
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.submit(this.state.value);
    }
  }

  submit(title) {
    this.props.submit(title);
  }

  render() {
    return (
      <li className="create-playlist">
        <input type="text" className="unstyled-input" ref="playlistInput"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </li>
    );
  }
}

CreatePlaylist.propTypes = {
  active: React.PropTypes.bool,
  submit: React.PropTypes.func,
};
