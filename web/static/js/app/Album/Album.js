import React, { Component, PropTypes } from 'react';
import TrackList from '../Track/TrackList';

export default class Album extends Component {
  render() {
    const { album, onClickHandler, currentId } = this.props;

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
              onClickHandler={onClickHandler}
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
