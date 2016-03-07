import React, { Component } from 'react';
import ReactList from 'react-list';
import TrackList from './TrackList';
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

  render() {
    const { artists, currentKey } = this.props;
    const { selected } = this.state;
    const setActive = this.setActiveCard.bind(this);

    return (
      <ReactList
        itemRenderer={(index, key) => <ArtistCard key={key} artist={artists[index]} selected={selected == artists[index].id} currentKey={currentKey} clickHandler={setActive} />}
        itemsRenderer={(items,ref) => <div className="card-list" ref={ref}>{items}</div>}
        length={artists.length}
        axis='y'
        type='uniform'
        useTranslate3d={true}
      />
    );
  }
}

export default ArtistList;
