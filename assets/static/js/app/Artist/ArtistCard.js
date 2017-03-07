import React, { PureComponent, PropTypes } from 'react';
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

export default class ArtistCard extends PureComponent {
  static propTypes = {
    artist: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { artist } = this.props;

    if (!artist) {
      return emptyCard;
    }

    return (
      <Link to={`/artists/${artist.id}`} className="card">
        <div className="card-image">
          <img
            src={artist.image_url || '/images/album_placeholder.png'}
            alt={artist.name}
            role="presentation"
            width="150"
            height="150"
          />
        </div>
        <div className="card-content">{artist.name}</div>
      </Link>
    );
  }
}
