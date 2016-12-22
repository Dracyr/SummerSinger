import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateTrack } from './actions';
import StarRating from './StarRating';

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

    const currentTrack = isPlaying ?
      (<span className="playing-icon"><i className="fa fa-volume-up"></i></span>) : '';
    const trackStyle = isSelected ? { background: '#dadada' } : {};

    const title = track.title ? track.title : track.filename;

    return (
      <div
        className="tr track"
        draggable
        onDragStart={this.handleOnDragStart}
        onClick={this.handleOnClick}
        onContextMenu={this.handleOnContextMenu}
        style={trackStyle}
      >
        <div className="td td-title" alt={title}><div>
          {title}
          {currentTrack}
        </div></div>
        <div className="td td-artist" alt={track.artist}><div>{track.artist}</div></div>
        <div className="td td-album" alt={track.album}><div>{track.album}</div></div>
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

export default connect(null, mapDispatch)(Track);

Track.propTypes = {
  onClickHandler: PropTypes.func,
  openContextMenu: PropTypes.func,
  selectTrack: PropTypes.func,
  track: PropTypes.object,
  isPlaying: PropTypes.bool,
  isSelected: PropTypes.bool,
  index: PropTypes.number,
  updateTrack: PropTypes.func,
};
