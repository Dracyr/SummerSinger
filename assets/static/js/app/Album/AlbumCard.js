import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { PlaceholderText } from '../Util/Util';

const emptyCard = (
  <div className="card">
    <div className="card-image">
      <img
        src="/images/album_placeholder.png"
        alt="placeholder"
        width="150"
        height="150"
      />
    </div>
    <div className="card-content"><PlaceholderText /></div>
  </div>
);

const AlbumCard = (props) => {
  const album = props.album;

  if (!album) { return emptyCard; }

  return (
    <Link to={`/albums/${album.id}`} className="card">
      <div className="card-image">
        <img
          src={(album.cover_art_thumb_url) || '/images/album_placeholder.png'}
          alt={album.title}
          width="150"
          height="150"
        />
      </div>
      <div className="card-content">
        {album.title}
        <br />
        <small>{album.artist}</small>
      </div>
    </Link>
  );
};

AlbumCard.propTypes = {
  album: PropTypes.object,
};

export default AlbumCard;
