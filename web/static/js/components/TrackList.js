import React, { Component } from 'react';
import InfiniteReactList from '../lib/InfiniteReactList';
import { PlaceholderText } from '../lib/Util';

import StarRating from './StarRating';
import TrackContextMenu from './TrackContextMenu';

export class Track extends Component {
  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnContextMenu = this.handleOnContextMenu.bind(this);
  }

  handleOnClick(e) {
    this.props.onClickHandler(this.props.track);
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
        <div className="td td-rating"><StarRating rating={track.rating}></StarRating></div>
      </div>
    );
  }
}

export default class TrackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextMenu: false,
      selectedTrack: null,
    };

    this.openContextMenu = this.openContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
  }

  openContextMenu(track, x, y) {
    this.setState({
      contextMenu: { x, y },
      selectedTrack: track,
    });
  }

  hideContextMenu() {
    this.setState({
      contextMenu: false,
      selectedTrack: null,
    });
  }

  loadMoreRows(from, size) {
    if (this.props.loadMoreRows) {
      this.props.loadMoreRows(from, size);
    }
  }

  isRowLoaded(index) {
    return !!this.props.tracks[index];
  }

  renderItem(index, key) {
    let trackComponent = '';
    if (this.isRowLoaded(index)) {
      const { tracks, keyAttr, currentKey, onClickHandler } = this.props;
      const track = tracks[index];
      const isSelected = this.state.selectedTrack && track.id === this.state.selectedTrack.id;
      const isPlaying = ((keyAttr === 'index' && index === currentKey) ||
                        (keyAttr === 'id' && track.id === currentKey));
      console.log(keyAttr, index, currentKey, isPlaying);

      trackComponent = (
        <Track track={track}
          key={key}
          isPlaying={isPlaying}
          isSelected={isSelected}
          onClickHandler={onClickHandler}
          openContextMenu={this.openContextMenu}
        />);
    } else {
      trackComponent = (
        <div className="tr track" key={key}>
          <div className="td td-title"><div><PlaceholderText /></div></div>
          <div className="td td-artist"><div><PlaceholderText /></div></div>
          <div className="td td-album"><div></div></div>
          <div className="td td-rating"><StarRating rating={0} /></div>
        </div>
      );
    }
    return trackComponent;
  }

  renderItems(items, ref) {
    return <div className="tbody" ref={ref}>{items}</div>;
  }

  render() {
    const { tracks, totalTracks } = this.props;
    const trackCount = totalTracks || tracks.length;

    if (tracks.length > 0) {
      return (
        <div className="display-table track-list">
          <div className="thead">
            <div className="tr">
              <div className="td td-title">Title</div>
              <div className="td td-artist">Artist</div>
              <div className="td td-album">Album</div>
              <div className="td td-rating">Rating</div>
            </div>
          </div>
          <InfiniteReactList
            itemRenderer={this.renderItem}
            itemsRenderer={this.renderItems}
            length={trackCount}
            localLength={tracks.length}
            type="uniform"
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
          />
          {this.state.contextMenu ?
            <TrackContextMenu
              context={this.state.contextMenu}
              hideContextMenu={this.hideContextMenu}
              track={this.state.selectedTrack}
            /> : ''
          }
        </div>
      );
    } else {
      return (
        <div className="no_tracks_banner">
          No tracks.
        </div>
      );
    }
  }
}

TrackList.propTypes = {
  tracks: React.PropTypes.array,
  keyAttr: React.PropTypes.string,
  currentKey: React.PropTypes.string,
  onClickHandler: React.PropTypes.func,
  totalTracks: React.PropTypes.number,
  loadMoreRows: React.PropTypes.func,
};
