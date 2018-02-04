import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Album from '../Album/Album';
import TrackList from '../Track/TrackList';
import { requestQueueAndPlayTrack } from 'Containers/Player/actions';
import { fetchArtist } from './actions';

class Artist extends PureComponent {
  static propTypes = {
    artist: PropTypes.object,
    fetch: PropTypes.func.isRequired,
    match: PropTypes.object,
    onClickHandler: PropTypes.func,
    currentId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    onClickHandler: () => {},
    currentId: null,
    artist: null,
  }

  componentDidMount() {
    const { artist, fetch, match } = this.props;
    if (match) {
      const artistId = parseInt(match.params.artistId, 10);
      if (!artist || artist.id !== artistId) {
        fetch(artistId);
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
          renderList={({ entries, renderItem }) => (
            entries.map((track, index) => (
              renderItem({ index, key: track.id })
            ))
          )}
        />
      );
    }

    return (
      <div>
        <h1>{artist.name}</h1>
        {artist.albums.map(album => (
          <Album
            key={album.id}
            album={album}
            onClickHandler={onClickHandler}
            currentId={currentId}
          />
        ))}

        {trackList}
      </div>
    );
  }
}

function mapState(state, ownProps) {
  return {
    artist: ownProps.artist || state.artists.artist,
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
  };
}

function mapDispatch(dispatch) {
  return {
    onClickHandler: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
    fetch: (...args) => dispatch(fetchArtist(...args)),
  };
}

export default connect(mapState, mapDispatch)(Artist);
