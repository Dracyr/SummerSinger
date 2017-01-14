import React, { Component } from 'react';
import ReactList from 'react-list';
import { PlaceholderText } from '../Util/Util';

class AlbumCard extends Component {

  render() {
    const album = this.props.album;

    return (
      <div className="card">
        <div className="card-image">
          <img src="/images/album_placeholder.png" width="150" height="150"></img>
        </div>
        <div className="card-content">
          {album && album.title}
          <br />
          <small>{album && album.artist}</small>
        </div>
      </div>
    );
  }
}

export default class AlbumList extends Component {
  getEntryList() {
    return this.entryList;
  }

  renderItem(index, key) {
    if (this.props.entries[index]) {
      const { entries } = this.props;
      return <AlbumCard key={key} album={entries[index]} />;
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
    const { entries, totalAlbums } = this.props;
    const albumCount = totalAlbums || entries.length;

    return (
      <ReactList
        itemRenderer={(index, key) => <AlbumCard key={key} album={entries[index]} />}
        itemsRenderer={(items, ref) => <div className="card-list" ref={ref}>{items}</div>}
        length={albumCount}
        localLength={entries.length}
        axis="y"
        type="uniform"
        useTranslate3d
        isRowLoaded={(index) => this.isRowLoaded(index)}
        loadMoreRows={(from, size) => this.loadMoreRows(from, size)}
        ref={(c) => { this.entryList = c; }}
      />
    );
  }
}
