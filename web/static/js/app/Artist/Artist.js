import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Album from '../Album/Album';
import TrackList from '../Track/TrackList';
import { requestQueueAndPlayTrack } from '../Player/actions';
import { fetchArtist } from './actions';

class Artist extends Component {
  componentDidMount() {
    const { artist, fetchArtist, match } = this.props;
    if (match) {
      const artistId = parseInt(match.params.artistId, 10);
      if (!artist || artist.id !== artistId) {
        fetchArtist(artistId);
      }
    }
  }

  render() {
    const { artist, onClickHandler, currentId } = this.props;

    if (!artist) { return null; }

    let trackList = '';
    if (artist.artist_tracks && artist.artist_tracks.length > 0) {
      trackList = (
        <TrackList
          entries={artist.artist_tracks}
          keyAttr={'id'}
          currentKey={currentId}
          onClickHandler={onClickHandler}
        />
      );
    }

    return (
      <div>
        <h1>{artist.name}</h1>
        {artist.albums.map(album =>
          <Album
            album={album}
            albumA={album}
            onClickHandler={onClickHandler}
            currentId={currentId}
            key={album.id}
          />
        )}

        {trackList}
      </div>
    );
  }
}

Artist.propTypes = {
  artist: PropTypes.object,
};

function mapState(state, ownProps) {
  return {
    artist: ownProps.artist || state.artists.artist,
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
  };
}

function mapDispatch(dispatch) {
  return {
    onClickHandler: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
    fetchArtist: (...args) => dispatch(fetchArtist(...args)),
  };
}

export default connect(mapState, mapDispatch)(Artist);
