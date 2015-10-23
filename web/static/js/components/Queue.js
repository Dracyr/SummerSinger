import React, { Component } from 'react';

class QueueItem extends Component {

  playTrack() {
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

class Queue extends Component {
  render() {
    var currentId = this.props.currentId;
    var queueItems = this.props.queueItems;
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
          {queueItems.map(function(queueItem) {
            return <QueueItem key={queueItem.id} track={queueItem} currentId={currentId}/>;
          })}
        </tbody>
      </table>
    );
  }
}

export default Queue;
