import React, { Component } from 'react';
import InfiniteReactList from '../lib/InfiniteReactList';

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
  isRowLoaded(index) {
    return !!this.props.albums[index];
  }

  loadMoreRows(from, size) {
    const { loadMoreRows } = this.props;
    loadMoreRows && loadMoreRows(from, size);
  }

  renderItem(index, key) {
    if (this.isRowLoaded(index)) {
      const { albums } = this.props;
      return <AlbumCard key={key} album={albums[index]} />;
    } else {
      return (
        <div className="card" key={key}>
          <div className="card-image">
            <img src="/images/album_placeholder.png" width="150" height="150"></img>
          </div>
          <div className="card-content"><PlaceholderText /></div>
        </div>
      );
    }
  }

  render() {
    const { albums, totalAlbums } = this.props;
    const albumCount = totalAlbums || albums.length;

    return (
      <InfiniteReactList
        itemRenderer={(index, key) => <AlbumCard key={key} album={albums[index]} />}
        itemsRenderer={(items,ref) => <div className="card-list" ref={ref}>{items}</div>}
        length={albumCount}
        localLength={albums.length}
        axis='y'
        type='uniform'
        useTranslate3d={true}
        isRowLoaded={(index) => this.isRowLoaded(index)}
        loadMoreRows={(from, size) => this.loadMoreRows(from, size)}
      />
    );
  }
}
