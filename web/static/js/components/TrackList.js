import React, { Component } from 'react';
import InfiniteReactList from '../lib/InfiniteReactList';
import { VirtualScroll } from 'react-virtualized';

class StarRating extends Component {

 render() {
    const { rating } = this.props;
    const stars = rating ? Math.floor((rating / 255) * 10) / 2 : 0;
    const half_star = stars - Math.floor(stars) === 0.5;

    return (
      <span>
        {[...Array(Math.floor(stars) - (half_star ? 1 : 0))].map( (x,i) =>
          <i key={i} className="fa fa-star"></i>
        )}

        {half_star ? <i className="fa fa-star-half-o"></i> : ''}

        {[...Array(5 - Math.floor(stars))].map( (x,i) =>
          <i key={Math.floor(stars) + i} className="fa fa-star-o"></i>
        )}
      </span>
    );
  }
}

class Track extends Component {

 render() {
    const {track, keyAttr, currentKey, onClickHandler} = this.props;

    let currentTrack = '';
    if (track[keyAttr] === currentKey) {
      currentTrack = <span className="playing-icon"><i className="fa fa-volume-up"></i></span>;
    }

    return (
      <div className="tr track" onClick={(event) => onClickHandler(track)}>
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

class PlaceholderText extends Component {

  render() {
    const style = {
      width: '50%',
      height: '1em',
      display: 'inline-block',
      'backgroundColor': '#ddd'
    };
    return <div style={style}></div>;
  }
}

class TrackList extends Component {

  loadMoreRows(from, size) {
    const { loadMoreRows } = this.props;
    loadMoreRows && loadMoreRows(from, size);
  }

  isRowLoaded(index) {
    return !!this.props.tracks[index];
  }

  renderItem(index, key) {
    if (this.isRowLoaded(index)) {
      const {tracks, keyAttr, currentKey, onClickHandler } = this.props;
      const track = tracks[index];
      return <Track
                track={track}
                key={track[keyAttr]}
                keyAttr={keyAttr}
                currentKey={currentKey}
                onClickHandler={onClickHandler} />;
    } else {
      return (
        <div className="tr track" key={key}>
          <div className="td td-title"><div><PlaceholderText/></div></div>
          <div className="td td-artist"><div><PlaceholderText/></div></div>
          <div className="td td-album"><div></div></div>
          <div className="td td-rating"><StarRating rating={0}></StarRating></div>
        </div>
      );
    }
  }

  render() {
    const {tracks, keyAttr, currentKey, onClickHandler } = this.props;
    const trackCount = this.props.totalTracks || tracks.length;

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
            itemRenderer={(index, key) => this.renderItem(index, key)}
            itemsRenderer={(items, ref) => <div className="tbody" ref={ref}>{items}</div>}
            length={trackCount}
            localLength={tracks.length}
            type='uniform'
            isRowLoaded={(index) => this.isRowLoaded(index)}
            loadMoreRows={(from, size) => this.loadMoreRows(from, size)}
          />
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

export default TrackList;
