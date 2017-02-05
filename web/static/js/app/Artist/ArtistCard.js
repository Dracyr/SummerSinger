import React, { Component, PropTypes } from 'react';
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

export default class ArtistCard extends Component {
  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.onClickHandler(this.props.artist);
  }

  render() {
    const { artist } = this.props;

    if (!artist) {
      return emptyCard;
    }

    return (
      <div className="card" onClick={this.handleOnClick}>
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
      </div>
    );
  }
}

ArtistCard.propTypes = {
  artist: PropTypes.object,
  onClickHandler: PropTypes.func,
};
