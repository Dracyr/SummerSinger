import React, { Component } from 'react';
import { fetchLibrary, requestQueueTrack } from '../actionCreators';


class Track extends Component {
  render() {
    const track = this.props.track;

    return (
      <tr onClick={() => requestQueueTrack(track.id)}>
        <td>{track.title}</td>
        <td>{track.artist}</td>
        <td>{track.album}</td>
        <td></td>
      </tr>
    );
  }
}

class Library extends Component {
  componentDidMount() {
    if (this.props.library.length === 0) {
      this.props.dispatch(fetchLibrary());
    }
  }

  render() {
    return (
      <table className="table table-hover track-list">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {this.props.library.map(function(track) {
            return <Track key={track.id} track={track}/>;
          })}
        </tbody>
      </table>
    );
  }
}

export default Library;
