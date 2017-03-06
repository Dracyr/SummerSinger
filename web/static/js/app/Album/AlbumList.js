import React, { PureComponent, PropTypes } from 'react';
import ReactList from 'react-list';

import proxyList from '../Util/InfiniteList';
import AlbumCard from './AlbumCard';

export default class AlbumList extends PureComponent {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    totalAlbums: PropTypes.number,
  };

  static defaultProps = {
    totalAlbums: null,
  }

  // Used by InfiniteList
  getEntryList() {
    return this.entryList;
  }

  render() {
    const { entries, totalAlbums } = this.props;
    const albumCount = totalAlbums || entries.length;

    return (
      <ReactList
        itemRenderer={(index, key) =>
          <AlbumCard key={key} album={entries[index]} />
        }
        itemsRenderer={(items, ref) =>
          <div className="card-list" ref={ref}>
            {items}
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
