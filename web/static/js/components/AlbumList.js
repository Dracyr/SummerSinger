import React, { Component } from 'react';

class AlbumCard extends Component {

 render() {
    const { album } = this.props;

    return (
      <div className="card">
        <div className="card-image">
          <img src="http://placehold.it/150x150"></img>
        </div>
        <div className="card-content">{album.title}</div>
      </div>
    );
  }
}

export default class AlbumList extends Component {
  render() {
    const { albums } = this.props;

    return (
      <div className="card-list">
        {albums.map(function(album) {
          return <AlbumCard key={album.id} album={album} />;
        })}
      </div>
    );
  }
}
