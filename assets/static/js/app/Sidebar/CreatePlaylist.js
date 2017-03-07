import React, { PureComponent, PropTypes } from 'react';

export default class CreatePlaylist extends PureComponent {
  static propTypes = {
    submit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.playlistInput.focus();
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
        <input
          type="text"
          className="unstyled-input"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          placeholder="Playlist name"
          ref={(c) => { this.playlistInput = c; }}
        />
      </li>
    );
  }
}
