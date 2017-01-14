import React, { Component, PropTypes } from 'react';

import ReactList from 'react-list';
import { PlaceholderText } from '../Util/Util';

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

  getEntryList() {
    return this.entryList;
  }

  renderItem(index, key) {
    let item = '';
    if (this.props.entries[index]) {
      const { entries } = this.props;
      const { selected } = this.state;

      item = (<ArtistCard
        key={key}
        artist={entries[index]}
        selected={selected === entries[index].id}
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
    const { entries, totalArtists } = this.props;
    const artistCount = totalArtists || entries.length;

    return (
      <ReactList
        itemRenderer={(index, key) => this.renderItem(index, key)}
        itemsRenderer={(items, ref) => <div className="card-list" ref={ref}>{items}</div>}
        length={artistCount}
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

ArtistList.propTypes = {
  entries: PropTypes.array,
  totalArtists: PropTypes.number,
  selected: PropTypes.bool,
  loadMoreRows: PropTypes.func,
};

export default ArtistList;
