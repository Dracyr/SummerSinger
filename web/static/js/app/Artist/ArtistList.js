import React, { PureComponent, PropTypes } from 'react';
import ReactList from 'react-list';

import proxyList from '../Util/InfiniteList';
import ArtistCard from './ArtistCard';

export default class ArtistList extends PureComponent {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    totalArtists: PropTypes.number,
  };

  static defaultProps = {
    totalArtists: null,
  }

  // Used by InfiniteList
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
          />
        }
        itemsRenderer={(items, ref) =>
          <div className="card-list" ref={ref}>
            {items}
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

export const InfiniteArtistList = proxyList(ArtistList);

