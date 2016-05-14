import React, { Component, PropTypes } from 'react';

import InfiniteReactList from '../lib/InfiniteReactList';
import { PlaceholderText } from '../lib/Util';

const ArtistCard = (props) => {
  const { artist, clickHandler } = props;

  return (
    <div className="card" onClick={() => clickHandler(artist.id)}>
      <div className="card-image">
        <img
          src="/images/album_placeholder.png"
          role="presentation"
          width="150"
          height="150"
        />
      </div>
      <div className="card-content">{artist.name}</div>
    </div>
  );
};

ArtistCard.propTypes = {
  artist: PropTypes.object,
  clickHandler: PropTypes.func,
};

class ArtistList extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: null };
  }

  setActiveCard(id) {
    this.setState({
      selected: id,
    });
  }

  isRowLoaded(index) {
    return !!this.props.artists[index];
  }

  loadMoreRows(from, size) {
    if (this.props.loadMoreRows) {
      this.props.loadMoreRows(from, size);
    }
  }

  renderItem(index, key) {
    let item = '';
    if (this.isRowLoaded(index)) {
      const { artists } = this.props;
      const { selected } = this.state;

      item = (<ArtistCard
        key={key}
        artist={artists[index]}
        selected={selected === artists[index].id}
        clickHandler={() => this.setActive}
      />);
    } else {
      item = (
        <div className="card" key={key}>
          <div className="card-image">
            <img
              src="/images/album_placeholder.png"
              role="presentation"
              width="150"
              height="150"
            />
          </div>
          <div className="card-content"><PlaceholderText /></div>
        </div>
      );
    }
    return item;
  }

  render() {
    const { artists, totalArtists } = this.props;
    const artistCount = totalArtists || artists.length;

    return (
      <InfiniteReactList
        itemRenderer={(index, key) => this.renderItem(index, key)}
        itemsRenderer={(items, ref) => <div className="card-list" ref={ref}>{items}</div>}
        length={artistCount}
        localLength={artists.length}
        axis="y"
        type="uniform"
        useTranslate3d
        isRowLoaded={(index) => this.isRowLoaded(index)}
        loadMoreRows={(from, size) => this.loadMoreRows(from, size)}
      />
    );
  }
}

ArtistList.propTypes = {
  artists: PropTypes.array,
  totalArtists: PropTypes.number,
  selected: PropTypes.bool,
  loadMoreRows: PropTypes.func,
};

export default ArtistList;
