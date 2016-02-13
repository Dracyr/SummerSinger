import React, { Component } from 'react';
import TrackList from './TrackList';

class ArtistCard extends Component {

  render() {
    const { artist, active, clickHandler, selected, fetchArtistDetails } = this.props;
    this.props.fetchArtistDetails(this.props.artist.id);

    if (selected) {
      return (
        <div className="card expanded row">
          <div className="col-md-4">
            <img src="http://placehold.it/150x150"></img>
            <h3>
              {artist.name}
            </h3>
          </div>
          <div className="col-md-8">
            <TrackList tracks={artist.tracks || []} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="card" onClick={() => clickHandler(artist.id)}>
          <div className="card-image">
            <img src="http://placehold.it/150x150"></img>
          </div>
          <div className="card-content">{artist.name}</div>
        </div>
      );
    }
  }
}

class ArtistList extends Component {
  constructor(props) {
    super(props);
    console.log("getinintial");
    this.state = {selected: null};
  }

  setActiveCard(id) {
    this.setState({
      selected: id
    });
  }

  render() {
    const { artists, fetchArtistDetails } = this.props;
    const { selected } = this.state;
    const setActive = this.setActiveCard.bind(this);

    return (
      <div className="card-list">
        {artists.map(function(artist) {
          return <ArtistCard
                  key={artist.id}
                  artist={artist}
                  selected={selected == artist.id}
                  fetchArtistDetails={fetchArtistDetails}
                  clickHandler={setActive} />;
        })}
      </div>
    );
  }
}

export default ArtistList;
