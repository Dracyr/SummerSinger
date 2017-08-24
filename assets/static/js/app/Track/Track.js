import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import StarRating from './StarRating';
import { PlaceholderText } from '../Util/Util';

const emptyTrack = (
  <div className="tr track">
    <div className="td td-title"><PlaceholderText /></div>
    <div className="td td-artist"><PlaceholderText /></div>
    <div className="td td-album" />
    <div className="td td-rating"><StarRating rating={0} /></div>
  </div>
);

class Track extends PureComponent {
  static propTypes = {
    onClickHandler: PropTypes.func,
    openContextMenu: PropTypes.func,
    selectTrack: PropTypes.func,
    track: PropTypes.shape({
      title: PropTypes.string,
      id: PropTypes.number,
    }),
    isPlaying: PropTypes.bool,
    isSelected: PropTypes.bool,
    index: PropTypes.number,
    hideAlbum: PropTypes.bool,
  };

  static defaultProps = {
    hideAlbum: false,
    onClickHandler: () => {},
    openContextMenu: () => {},
    selectTrack: () => {},
    track: null,
    isPlaying: false,
    isSelected: false,
    index: null,
  };

  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnContextMenu = this.handleOnContextMenu.bind(this);
    this.handleOnDragStart = this.handleOnDragStart.bind(this);
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

  render() {
    const { track, isPlaying, isSelected } = this.props;

    if (!track) { return emptyTrack; }

    const currentTrack = isPlaying ?
      (<span className="playing-icon"><i className="fa fa-volume-up" /></span>) : '';
    const trackStyle = isSelected ? { ...this.props.style, background: '#dadada' } : this.props.style;

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
          <StarRating track={track} />
        </div>
      </div>
    );
  }
}

export default Track;
