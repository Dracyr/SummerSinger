import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { PlaceholderText } from "Util";
import StarRating from "./StarRating";

export const EmptyTrack = () => (
  <div className="tr track">
    <div className="td td-title">
      <PlaceholderText />
    </div>
    <div className="td td-artist">
      <PlaceholderText />
    </div>
    <div className="td td-album" />
    <div className="td td-rating">
      <StarRating rating={0} />
    </div>
  </div>
);

class Track extends Component {
  static propTypes = {
    handleOnClick: PropTypes.func,
    openContextMenu: PropTypes.func,
    track: PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.number
    }),
    isPlaying: PropTypes.bool,
    isSelected: PropTypes.bool,
    index: PropTypes.number,
    hideAlbum: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    handleOnClick: () => {},
    openContextMenu: () => {},
    track: null,
    isPlaying: false,
    isSelected: false,
    index: null,
    hideAlbum: false
  };

  handleOnClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.handleOnClick(this.props.track, this.props.index);
  };

  handleOnContextMenu = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.openContextMenu(this.props.track, e.pageX, e.pageY);
  };

  handleOnDragStart = e => {
    const payload = JSON.stringify({ track_id: this.props.track.id });
    e.dataTransfer.setData("text/plain", payload);
  };

  render() {
    const { track, isPlaying, isSelected } = this.props;

    if (!track) {
      return EmptyTrack;
    }

    const currentTrack = isPlaying ? (
      <span className="playing-icon">
        <i className="fa fa-volume-up" />
      </span>
    ) : (
      ""
    );

    const title = track.title ? track.title : track.filename;

    return (
      <div
        className={`tr track ${this.props.hideAlbum ? "hide-album" : ""} ${
          isSelected ? "selected" : ""
        }`}
        draggable
        onDragStart={this.handleOnDragStart}
        onContextMenu={this.handleOnContextMenu}
        onClick={this.handleOnClick}
        style={this.props.style}
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
          <StarRating track={track} />
        </div>
      </div>
    );
  }
}

export default Track;
