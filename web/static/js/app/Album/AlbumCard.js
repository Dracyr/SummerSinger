import React, { Component, PropTypes } from 'react';

export default class AlbumCard extends Component {
  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.onClickHandler(this.props.album);
  }

  render() {
    const { album } = this.props;
    return (
      <div className="card" onClick={this.handleOnClick}>
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
      </div>
    );
  }
}

AlbumCard.propTypes = {
  album: PropTypes.object,
};
