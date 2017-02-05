import React, { Component, PropTypes } from 'react';

import Album from '../Album/Album';
import TrackList from '../Track/TrackList';

export default class Artist extends Component {
  render() {
    const { artist, onClickHandler, currentId } = this.props;

    let trackList = '';
    if (artist.artist_tracks.length > 0) {
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
