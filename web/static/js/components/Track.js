import React, { Component, PropTypes } from 'react';

import StarRating from './StarRating';

export default class Track extends Component {
  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnContextMenu = this.handleOnContextMenu.bind(this);
  }

  handleOnClick() {
    if (this.props.isSelected) {
      this.props.onClickHandler(this.props.track);
    } else {
      this.props.selectTrack(this.props.track);
    }
  }

  handleOnContextMenu(e) {
    e.preventDefault();
    this.props.openContextMenu(this.props.track, e.pageX, e.pageY);
  }

  render() {
    const { track, isPlaying, isSelected } = this.props;

    const currentTrack = isPlaying ?
      (<span className="playing-icon"><i className="fa fa-volume-up"></i></span>) : '';
    const trackStyle = isSelected ? { background: '#dadada' } : {};

    return (
      <div
        className="tr track"
        onClick={this.handleOnClick}
        onContextMenu={this.handleOnContextMenu}
        style={trackStyle}
      >
        <div className="td td-title" alt={track.title}><div>
          {track.title}
          {currentTrack}
        </div></div>
        <div className="td td-artist" alt={track.artist}><div>{track.artist}</div></div>
        <div className="td td-album" alt={track.album}><div>{track.album}</div></div>
        <div className="td td-rating"><StarRating rating={track.rating} /></div>
      </div>
    );
  }
}

Track.propTypes = {
  onClickHandler: PropTypes.func,
  openContextMenu: PropTypes.func,
  selectTrack: PropTypes.func,
  track: PropTypes.object,
  isPlaying: PropTypes.bool,
  isSelected: PropTypes.bool,
};
