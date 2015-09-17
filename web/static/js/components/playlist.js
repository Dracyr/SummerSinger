import React, { Component } from 'react';
import QueueWrapper from '../lib/queue_wrapper';

class PlaylistItem extends Component {
  addTrackToQueue() {
    // Actions.addTrackToQueue(this.props.track.key);
  }

  render() {
    var track = this.props.track;

    return (
      <tr onClick={this.addTrackToQueue}>
        <td>{track.name}</td>
        <td>{track.artistName}</td>
        <td>{track.albumName}</td>
        <td></td>
      </tr>
    );
  }
}

export default class Playlist extends Component {

  render() {
    var playlist = this.props.playlist;
    var playlistWrapper = new QueueWrapper();
    playlistWrapper.setLibrary(this.state.store.library);
    playlistWrapper.reset(playlist.items);
    var playlistItems = playlistWrapper.getQueue();

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
          {playlistItems.map(function(playlistItem) {
            return <PlaylistItem key={playlistItem.id} track={playlistItem}/>;
          })}
        </tbody>
      </table>
    );
  }
}
