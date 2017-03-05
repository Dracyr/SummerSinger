import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import StarRating from './StarRating';
import { updateTrack } from './actions';
import { PlaceholderText } from '../Util/Util';

const emptyTrack = (
  <div className="tr track">
    <div className="td td-title"><PlaceholderText /></div>
    <div className="td td-artist"><PlaceholderText /></div>
    <div className="td td-album" />
    <div className="td td-rating"><StarRating rating={0} /></div>
  </div>
);

class Track extends Component {
  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnContextMenu = this.handleOnContextMenu.bind(this);
    this.handleOnDragStart = this.handleOnDragStart.bind(this);
    this.updateTrack = this.updateTrack.bind(this);
  }

  handleOnClick() {
    if (this.props.isSelected) {
      this.props.onClickHandler(this.props.track);
    } else {
      this.props.selectTrack(this.props.track, this.props.index);
    }
  }

  handleOnContextMenu(e) {
    e.preventDefault();
    this.props.openContextMenu(this.props.track, e.pageX, e.pageY);
  }

  handleOnDragStart(e) {
    const payload = JSON.stringify({ track_id: this.props.track.id });
    e.dataTransfer.setData('text/plain', payload);
  }

  updateTrack(params) {
    this.props.updateTrack(this.props.track.id, params);
  }

  render() {
    const { track, isPlaying, isSelected } = this.props;

    if (!track) {
      return emptyTrack;
    }

    const currentTrack = isPlaying ?
      (<span className="playing-icon"><i className="fa fa-volume-up"></i></span>) : '';
    const trackStyle = isSelected ? { background: '#dadada' } : {};

    const title = track.title ? track.title : track.filename;

    return (
      <div
        className={`tr track ${this.props.hideAlbum ? 'hide-album' : ''}`}
        draggable
        onDragStart={this.handleOnDragStart}
        onClick={this.handleOnClick}
        onContextMenu={this.handleOnContextMenu}
        style={trackStyle}
      >
        <div className="td td-title">
          <span title={title}>{title}</span>
          {currentTrack}
        </div>
        <div className="td td-artist">
          <Link to={`/artists/${track.artist_id}`} title={track.artist}>
            {track.artist}
          </Link>
        </div>
        {!this.props.hideAlbum ? (
          <div className="td td-album">
            <Link to={`/albums/${track.album_id}`} title={track.album}>
              {track.album}
            </Link>
          </div>
        ) : null}
        <div className="td td-rating">
          <StarRating
            rating={track.rating}
            updateTrack={this.updateTrack}
          />
        </div>
      </div>
    );
  }
}

function mapDispatch(dispatch) {
  return {
    updateTrack: (...args) => dispatch(updateTrack(...args)),
  };
}


Track.propTypes = {
  onClickHandler: PropTypes.func,
  openContextMenu: PropTypes.func,
  selectTrack: PropTypes.func,
  track: PropTypes.object,
  isPlaying: PropTypes.bool,
  isSelected: PropTypes.bool,
  index: PropTypes.number,
  updateTrack: PropTypes.func,
  hideAlbum: PropTypes.bool,
};

Track.defaultProps = {
  hideAlbum: false,
};

export default connect(null, mapDispatch)(Track);
