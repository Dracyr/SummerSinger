import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { requestQueueAndPlayTrack } from "Containers/Player/actions";
import { fetchAlbum as FetchAlbum } from "Containers/Albums/actions";
import TrackList from "Components/TrackList";
import { normalizeTracks } from "Util";

class Album extends Component {
  static propTypes = {
    album: PropTypes.object,
    match: PropTypes.object,
    fetchAlbum: PropTypes.func.isRequired,
    requestQueueAndPlayTrack: PropTypes.func.isRequired,
    currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  static defaultProps = {
    album: null,
    currentId: null
  };

  componentDidMount() {
    const { match, album, fetchAlbum } = this.props;
    if (this.props.match) {
      const albumId = parseInt(match.params.albumId, 10);
      if (!album || album.id !== albumId) {
        fetchAlbum(albumId);
      }
    }
  }

  render() {
    const { album, currentId } = this.props;

    if (!album) {
      return null;
    }

    return (
      <div style={{ marginBottom: 100 }}>
        <h2>{album.title}</h2>
        <div style={{ display: "flex" }}>
          <div
            style={{
              height: "300px",
              width: "300px",
              marginRight: "30px",
              marginTop: "40px"
            }}
          >
            <img
              src={album.cover_art_url || "/images/album_placeholder.png"}
              alt={album.title}
              width="300"
              height="300"
            />
          </div>
          <div style={{ width: "100%" }}>
            <TrackList
              keyAttr="id"
              currentKey={currentId}
              trackIds={(album.tracks || []).map(t => t.id)}
              tracksById={normalizeTracks(album.tracks)}
              onClickHandler={track =>
                this.props.requestQueueAndPlayTrack(track.id)
              }
              hideAlbum
              staticList
              renderHeader={() => (
                <div className="thead">
                  <div className="tr">
                    <div className="td td-title">Title </div>
                    <div className="td td-artist">Artist </div>
                    <div className="td td-rating">Rating </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state, ownProps) {
  return {
    album: ownProps.album || state.albums.album,
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null
  };
}

function mapDispatch(dispatch) {
  return {
    requestQueueAndPlayTrack: (...args) =>
      dispatch(requestQueueAndPlayTrack(...args)),
    fetchAlbum: (...args) => dispatch(FetchAlbum(...args))
  };
}

export default connect(mapState, mapDispatch)(Album);
