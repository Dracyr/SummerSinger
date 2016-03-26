import React, { Component } from 'react';

class CreatePlaylist extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      path: '',
    };
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }
  handleChangePath(event) {
    this.setState({ path: event.target.value });
  }

  render() {
    const { actions } = this.props;

    return (
      <div>
        <h1 className="header">Create Playlist</h1>
        <input type="text" value={this.state.title} onChange={this.handleChangeTitle} />
        <input type="text" value={this.state.path} onChange={this.handleChangePath} />

      </div>
    );
  }
}

export default CreatePlaylist;
