import React, { Component } from 'react';
import InfiniteReactList from '../lib/InfiniteReactList';
import { PlaceholderText } from '../lib/Util';
import { requestQueueTrack } from '../actions/player';

class ArtistCard extends Component {
  render() {
    const { artist, active, clickHandler, selected, currentKey } = this.props;

    return (
      <div className="card" onClick={() => clickHandler(artist.id)}>
        <div className="card-image">
          <img src="/images/album_placeholder.png" width="150" height="150"></img>
        </div>
        <div className="card-content">{artist.name}</div>
      </div>
    );
  }
}

class ArtistList extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: null};
  }

  setActiveCard(id) {
    this.setState({
      selected: id
    });
  }

  isRowLoaded(index) {
    return !!this.props.artists[index];
  }

  loadMoreRows(from, size) {
    const { loadMoreRows } = this.props;
    loadMoreRows && loadMoreRows(from, size);
  }

  renderItem(index, key) {
    if (this.isRowLoaded(index)) {
      const { artists, currentKey } = this.props;
      const { selected } = this.state;

      return <ArtistCard
                key={key}
                artist={artists[index]}
                selected={selected == artists[index].id}
                currentKey={currentKey}
                clickHandler={() => this.setActive} />;
    } else {
      return (
        <div className="card" key={key}>
          <div className="card-image">
            <img src="/images/album_placeholder.png" width="150" height="150"></img>
          </div>
          <div className="card-content"><PlaceholderText /></div>
        </div>
      );
    }
  }

  render() {
    const { artists, currentKey } = this.props;
    const { selected } = this.state;
    const artistCount = this.props.totalArtists || artists.length;

    return (
      <InfiniteReactList
        itemRenderer={(index, key) => this.renderItem(index, key)}
        itemsRenderer={(items,ref) => <div className="card-list" ref={ref}>{items}</div>}
        length={artistCount}
        localLength={artists.length}
        axis='y'
        type='uniform'
        useTranslate3d={true}
        isRowLoaded={(index) => this.isRowLoaded(index)}
        loadMoreRows={(from, size) => this.loadMoreRows(from, size)}
      />
    );
  }
}

export default ArtistList;
