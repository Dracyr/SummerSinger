import React, { PureComponent, PropTypes } from 'react';
import ReactList from 'react-list';

import proxyList from '../Util/InfiniteList';
import AlbumCard from './AlbumCard';

const renderItems = (items, ref) => (
  <div className="card-list" ref={ref}>
    {items}
  </div>
);

export default class AlbumList extends PureComponent {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    totalAlbums: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
  }

  // Used by InfiniteList
  getEntryList() {
    return this.entryList;
  }

  renderItem(index, key) {
    return <AlbumCard key={key} album={this.props.entries[index]} />;
  }

  render() {
    const { entries, totalAlbums } = this.props;
    return (
      <ReactList
        itemRenderer={this.renderItem}
        itemsRenderer={renderItems}
        length={totalAlbums || entries.length}
        axis="y"
        type="uniform"
        useStaticSize
        useTranslate3d
        ref={(c) => { this.entryList = c; }}
      />
    );
  }
}

export const InfiniteAlbumList = proxyList(AlbumList);
