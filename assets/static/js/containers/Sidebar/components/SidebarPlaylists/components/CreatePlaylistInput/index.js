import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class CreatePlaylist extends PureComponent {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  componentDidMount() {
    this.playlistInput.focus();
  }

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.props.submit(this.state.value);
    }
  };

  render() {
    return (
      <li className="create-playlist">
        <input
          ref={c => {
            this.playlistInput = c;
          }}
          type="text"
          className="unstyled-input"
          placeholder="Playlist name"
          value={this.state.value}
          onChange={event => this.setState({ value: event.target.value })}
          onKeyPress={this.handleKeyPress}
        />
      </li>
    );
  }
}
