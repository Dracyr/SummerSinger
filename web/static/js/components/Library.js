import React, { Component } from 'react';
import { fetchLibrary } from '../actionCreators';


class Track extends Component {

  queueTrack() {
    // Actions.playTrack(this.props.track.id);
  }

  render() {
    var track = this.props.track;

    var currentTrack = '';
    if (this.props.currentId === track.id) {
      currentTrack = <span className="playing-icon"><i className="fa fa-volume-up"></i></span>;
    }

    return (
      <tr onClick={this.playTrack}>
        <td>
          {track.name}
          {currentTrack}
        </td>
        <td>{track.artistName}</td>
        <td>{track.albumName}</td>
        <td></td>
      </tr>
    );
  }
}

class Library extends Component {
  componentDidMount() {
    console.log("library mounted");
    this.props.dispatch(fetchLibrary());
  }

  render() {
    const { currentId, tracks } = this.props;
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
          {tracks.map(function(track) {
            return <Track key={track.id} track={track} currentId={currentId}/>;
          })}
        </tbody>
      </table>
    );
  }
}

export default Library;
