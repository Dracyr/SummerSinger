import React, { PureComponent, PropTypes } from 'react';
import InfiniteGrid from '../Util/InfiniteGrid';
import Card, { EmptyCard } from '../Util/Card';

export default class ArtistList extends PureComponent {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    totalArtists: PropTypes.number.isRequired,
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
    const artist = this.props.entries[index];
    let artistComponent = '';
    if (artist) {
      artistComponent = (
        <Card
          key={key}
          style={style}
          url={`/artists/${artist.id}`}
          imageUrl={artist.image_url || '/images/album_placeholder.png'}
          title={artist.name}
        />
      );
    } else {
      artistComponent = <EmptyCard key={key} style={style} />;
    }
    return artistComponent;
  }

  render() {
    const { entries, totalArtists } = this.props;
    const artistCount = totalArtists || (entries && entries.length) || 0;

    return (
      <InfiniteGrid
        entryCount={artistCount}
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.props.loadMoreRows}
        renderItem={this.renderItem}
      />
    );
  }
}
