import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrackList from '../Track/TrackList';
import { requestQueueAndPlayTrack } from 'Containers/Player/actions';
import { fetchAlbum } from './actions';

class Album extends PureComponent {
  static propTypes = {
    album: PropTypes.object,
    match: PropTypes.object,
    fetch: PropTypes.func.isRequired,
    requestQueueAndPlayTrack: PropTypes.func.isRequired,
    currentId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    album: null,
  }

  componentDidMount() {
    if (this.props.match) {
      const album = this.props.album;
      const albumId = parseInt(this.props.match.params.albumId, 10);
      if (!album || album.id !== albumId) {
        this.props.fetch(albumId);
      }
    }
  }

  render() {
    const { album, currentId } = this.props;

    if (!album) { return null; }

    return (
      <div style={{ marginBottom: 100 }}>
        <h2>{album.title}</h2>
        <div style={{ display: 'flex' }}>
          <div style={{ height: '300px', width: '300px', marginRight: '30px', marginTop: '40px' }}>
            <img
              src={(album.cover_art_url) || '/images/album_placeholder.png'}
              alt={album.title}
              width="300"
              height="300"
            />
          </div>
          <div style={{ width: '100%' }}>
            <TrackList
              entries={album.tracks || []}
              keyAttr="id"
              currentKey={currentId}
              onClickHandler={track => this.props.requestQueueAndPlayTrack(track.id)}
              hideAlbum
              renderHeader={() => (
                <div className="thead">
                  <div className="tr">
                    <div className="td td-title">Title </div>
                    <div className="td td-artist">Artist </div>
                    <div className="td td-rating">Rating </div>
                  </div>
                </div>
              )}
              renderList={({ entries, renderItem }) => (
                entries.map((track, index) => (
                  renderItem({ index, key: track.id })
                ))
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state, ownProps) {
  return {
    album: ownProps.album || state.albums.album,
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
  };
}

function mapDispatch(dispatch) {
  return {
    requestQueueAndPlayTrack: (...args) => dispatch(requestQueueAndPlayTrack(...args)),
    fetch: (...args) => dispatch(fetchAlbum(...args)),
  };
}

export default connect(mapState, mapDispatch)(Album);
