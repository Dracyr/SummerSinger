import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Album from '../Album/Album';
import TrackList from '../Track/TrackList';
import { requestQueueAndPlayTrack } from '../Player/actions';

class Artist extends Component {
  render() {
    const { artist, onClickHandler, currentId } = this.props;

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
  let artist = ownProps.artist;
  if (ownProps.match) {
    const artistId = parseInt(ownProps.match.params.artistId, 10);
    artist = state.library.artists.find(a => a && a.id === artistId);
  }

  return {
    artist,
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
  };
}

function mapDispatch(dispatch) {
  return {
    onClickHandler: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
  };
}

export default connect(mapState, mapDispatch)(Artist);
