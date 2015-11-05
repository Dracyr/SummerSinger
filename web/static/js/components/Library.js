import React, { Component } from 'react';
import { fetchLibrary, requestQueueTrack } from '../actionCreators';


class Track extends Component {
  render() {
    var track = this.props.track;

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
    this.props.dispatch(fetchLibrary());
  }

  render() {
    const { library } = this.props;
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {library.map(function(track) {
            return <Track key={track.id} track={track}/>;
          })}
        </tbody>
      </table>
    );
  }
}

export default Library;
