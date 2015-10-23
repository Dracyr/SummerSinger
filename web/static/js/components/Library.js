import React, { Component } from 'react';
import { fetchLibrary, requestQueueTrack } from '../actionCreators';


class Track extends Component {
  render() {
    var track = this.props.track;

    var currentTrack = '';
    if (this.props.currentId === track.id) {
      currentTrack = <span className="playing-icon"><i className="fa fa-volume-up"></i></span>;
    }

    return (
      <tr onClick={() => requestQueueTrack(track.id)}>
        <td>
          {track.title}
          {currentTrack}
        </td>
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
    const { currentId, library } = this.props;
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
            return <Track key={track.id} track={track} currentId={currentId}/>;
          })}
        </tbody>
      </table>
    );
  }
}

export default Library;
