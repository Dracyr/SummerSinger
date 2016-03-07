import React, { Component } from 'react';
import ReactList from 'react-list';

class AlbumCard extends Component {

 render() {
    const { album } = this.props;

    return (
      <div className="card">
        <div className="card-image">
          <img src="/images/album_placeholder.png" width="150" height="150"></img>
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
      <ReactList
        itemRenderer={(index, key) => <AlbumCard key={key} album={albums[index]} />}
        itemsRenderer={(items,ref) => <div className="card-list" ref={ref}>{items}</div>}
        length={albums.length}
        axis='y'
        type='uniform'
        useTranslate3d={true}
      />
    );
  }
}
