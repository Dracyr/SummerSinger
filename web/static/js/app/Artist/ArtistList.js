import React, { Component, PropTypes } from 'react';
import ReactList from 'react-list';

import ArtistCard from './ArtistCard';

class ArtistList extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: null };
  }

  getEntryList() {
    return this.entryList;
  }

  render() {
    const { entries, totalArtists } = this.props;
    const artistCount = totalArtists || entries.length;

    return (
      <ReactList
        itemRenderer={(index, key) =>
          <ArtistCard
            key={key}
            artist={entries[index]}
            onClickHandler={this.props.onClickHandler}
          />
        }
        itemsRenderer={(items, ref) =>
          <div
            className="card-list"
            ref={ref}>{items}
          </div>
        }
        length={artistCount}
        localLength={entries.length}
        axis="y"
        type="uniform"
        useStaticSize
        useTranslate3d
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
