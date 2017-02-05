import React, { Component } from 'react';
import ReactList from 'react-list';
import proxyList from '../Util/InfiniteList';
import AlbumCard from './AlbumCard';

export default class AlbumList extends Component {
  // Used by others
  getEntryList() {
    return this.entryList;
  }

  render() {
    const { entries, totalAlbums } = this.props;
    const albumCount = totalAlbums || entries.length;

    return (
      <ReactList
        itemRenderer={(index, key) =>
          <AlbumCard
            key={key}
            album={entries[index]}
            onClickHandler={this.props.onClickHandler}
          />
        }
        itemsRenderer={(items, ref) =>
          <div
            className="card-list"
            ref={ref}>{items}
          </div>
        }
        length={albumCount}
        localLength={entries.length}
        axis="y"
        type="uniform"
        useStaticSize
        ref={(c) => { this.entryList = c; }}
      />
    );
  }
}

export const InfiniteAlbumList = proxyList(AlbumList);
