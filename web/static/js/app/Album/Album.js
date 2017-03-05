import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TrackList from '../Track/TrackList';
import { requestQueueAndPlayTrack } from '../Player/actions';

class Album extends Component {
  render() {
    const { album, requestQueueAndPlayTrack, currentId } = this.props;

    return (
      <div>
        <h2>{album && album.title}</h2>
        <div style={{ display: 'flex' }}>
          <div style={{ height: '300px', width: '300px', marginRight: '30px', marginTop: '40px' }}>
            <img
              src={(album && album.cover_art_url) || '/images/album_placeholder.png'}
              alt={album && album.title}
              width="300"
              height="300"
            />
          </div>
          <div style={{ width: '100%' }}>
            <TrackList
              entries={album.tracks || []}
              keyAttr={'id'}
              currentKey={currentId}
              onClickHandler={track => requestQueueAndPlayTrack(track.id)}
            />
          </div>
        </div>
      </div>
    );
  }
}

Album.propTypes = {
  album: PropTypes.object,
};

function mapState(state, ownProps) {
  let album = ownProps.album;
  if (ownProps.match) {
    const albumId = parseInt(ownProps.match.params.albumId, 10);
    album = state.library.albums.find(a => a && a.id === albumId);
  }

  return {
    album,
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
  };
}

function mapDispatch(dispatch) {
  return {
    requestQueueAndPlayTrack: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
  };
}

export default connect(mapState, mapDispatch)(Album);
