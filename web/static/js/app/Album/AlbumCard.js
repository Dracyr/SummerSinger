import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { PlaceholderText } from '../Util/Util';

const emptyCard = (
  <div className="card">
    <div className="card-image">
      <img
        src="/images/album_placeholder.png"
        role="presentation"
        width="150"
        height="150"
      />
    </div>
    <div className="card-content"><PlaceholderText /></div>
  </div>
);

const AlbumCard = (props) => {
  const album = props.album;

  if (!album) {
    return emptyCard;
  }

  return (
    <Link to={`/albums/${album.id}`} className="card">
      <div className="card-image">
        <img
          src={(album && album.cover_art_thumb_url) || '/images/album_placeholder.png'}
          alt={album && album.title}
          width="150"
          height="150"
        />
      </div>
      <div className="card-content">
        {album && album.title}
        <br />
        <small>{album && album.artist}</small>
      </div>
    </Link>
  );
}

AlbumCard.propTypes = {
  album: PropTypes.object,
};

export default AlbumCard;
