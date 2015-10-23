import React, { Component } from 'react';
import { requestPlayTrack } from '../actionCreators';

class QueueItem extends Component {

 render() {
    var track = this.props.track;

    var currentTrack = '';
    if (this.props.currentId === track.id) {
      currentTrack = <span className="playing-icon"><i className="fa fa-volume-up"></i></span>;
    }

    return (
      <tr onClick={() => requestPlayTrack(track.index)}>
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
            return <QueueItem key={queueItem.index} track={queueItem} currentId={currentId}/>;
          })}
        </tbody>
      </table>
    );
  }
}

export default Queue;
