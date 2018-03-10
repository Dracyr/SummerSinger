import React, { Component } from "react";
import PropTypes from "prop-types";
import InfiniteGrid from "Components/InfiniteGrid";
import Card from "Components/Card";

export default class AlbumList extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        artist: PropTypes.string,
        cover_art_url: PropTypes.string
      })
    ),
    totalAlbums: PropTypes.number,
    loadMoreRows: PropTypes.func
  };

  static defaultProps = {
    entries: [],
    totalAlbums: 0,
    loadMoreRows: () => {}
  };

  constructor() {
    super();
    this.requestedPages = new Set();
  }

  shouldComponentUpdate(nextProps) {
    const { entries, totalAlbums } = this.props;
    return (
      entries.length !== nextProps.entries.length ||
      totalAlbums !== nextProps.totalAlbums
    );
  }

  isRowLoaded = ({ index }) =>
    !!(this.props.entries && this.props.entries[index]);

  renderItem = ({ columnIndex, rowIndex, key, style }) => {
    const album = this.props.entries[rowIndex * 5 + columnIndex];

    if (album) {
      return (
        <Card
          key={key}
          style={style}
          url={`/albums/${album.id}`}
          imageUrl={
            album.cover_art_thumb_url || "/images/album_placeholder.png"
          }
          title={album.title}
          subTitle={album.artist}
        />
      );
    }
    return null;
  };

  render() {
    const { entries, totalAlbums } = this.props;

    return (
      <InfiniteGrid
        entryCount={totalAlbums || (entries && entries.length) || 0}
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.props.loadMoreRows}
        renderItem={this.renderItem}
      />
    );
  }
}
