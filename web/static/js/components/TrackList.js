import React, { Component } from 'react';
import ReactList from 'react-list';

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
        <div className="td td-title"><div>
          {track.title}
          {currentTrack}
        </div></div>
        <div className="td td-artist"><div>{track.artist}</div></div>
        <div className="td td-album"><div>{track.album}</div></div>
        <div className="td td-rating"><StarRating rating={track.rating}></StarRating></div>
      </div>
    );
  }
}

class TrackList extends Component {

  renderItem(index, key) {
    const {tracks, keyAttr, currentKey, onClickHandler } = this.props;
    const track = tracks[index];
    return <Track
              track={track}
              key={track[keyAttr]}
              keyAttr={keyAttr}
              currentKey={currentKey}
              onClickHandler={onClickHandler} />;
  }

  render() {
    const {tracks, keyAttr, currentKey, onClickHandler } = this.props;

    if (tracks.length > 0) {
      return (
        <div className="table display-table table-hover track-list">
          <div className="thead">
            <div className="tr">
              <div className="td td-title">Title</div>
              <div className="td td-artist">Artist</div>
              <div className="td td-album">Album</div>
              <div className="td td-rating">Rating</div>
            </div>
          </div>
          <ReactList
            itemRenderer={(index, key) => this.renderItem(index, key)}
            itemsRenderer={(items,ref) => <div className="tbody" ref={ref}>{items}</div>}
            length={tracks.length}

            type='uniform'
          />
        </div>
      );
    } else {
      return (
        <div className="no_tracks_banner">
          No tracks in selection :(
        </div>
      );
    }
  }
}

export default TrackList;
