import React, { Component } from 'react';

class StarRating extends Component {

 render() {
    const {rating} = this.props;
    const stars = rating ? Math.floor((rating / 255) * 5) : 0;

    return (
      <span>
        {[...Array(stars)].map( (x,i) =>
          <i key={i} className="fa fa-star"></i>
        )}
        {[...Array(5 - stars)].map( (x,i) =>
          <i key={stars + i} className="fa fa-star-o"></i>
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
      <tr onClick={(event) => onClickHandler(track)}>
        <td>
          {track.title}
          {currentTrack}
        </td>
        <td>{track.artist}</td>
        <td>{track.album}</td>
        <td><StarRating rating={track.rating}></StarRating></td>
      </tr>
    );
  }
}

class TrackList extends Component {
  render() {
    const {tracks, keyAttr, currentKey, onClickHandler } = this.props;

    return (
      <table className="table table-hover track-list">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map(function(track) {
            return <Track track={track}
                          key={track[keyAttr]}
                          keyAttr={keyAttr}
                          currentKey={currentKey}
                          onClickHandler={onClickHandler} />;
          })}
        </tbody>
      </table>
    );
  }
}

export default TrackList;
