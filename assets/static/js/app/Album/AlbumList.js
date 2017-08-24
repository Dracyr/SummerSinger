import React, { PureComponent, PropTypes } from 'react';
import InfiniteGrid from '../Util/InfiniteGrid';
import Card, { EmptyCard } from '../Util/Card';

export default class AlbumList extends PureComponent {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    totalAlbums: PropTypes.number.isRequired,
    loadMoreRows: PropTypes.func,
  };

  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.requestedPages = new Set();
  }

  isRowLoaded({ index }) {
    return !!(this.props.entries && this.props.entries[index]);
  }

  renderItem({ columnIndex, rowIndex, key, style }) {
    const index = (rowIndex * 5) + columnIndex;
    const album = this.props.entries[index];
    let albumComponent = '';
    if (album) {
      albumComponent = (
        <Card
          key={key}
          style={style}
          url={`/albums/${album.id}`}
          imageUrl={(album.cover_art_thumb_url) || '/images/album_placeholder.png'}
          title={album.title}
          subTitle={album.artist}
        />
      );
    } else {
      albumComponent = <EmptyCard key={key} style={style} />;
    }
    return albumComponent;
  }

  render() {
    const { entries, totalAlbums } = this.props;
    const albumCount = totalAlbums || (entries && entries.length) || 0;

    return (
      <InfiniteGrid
        entryCount={albumCount}
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.props.loadMoreRows}
        renderItem={this.renderItem}
      />
    );
  }
}
