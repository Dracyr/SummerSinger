import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import TrackList from "Components/TrackList";
import Track from "Containers/Tracks/components/Track";
import { requestImport as RequestImport } from "./actions";

class Importer extends Component {
  constructor() {
    super();

    this.state = {
      path: null,
      open: false
    };
  }

  importIt = () => {
    console.log("YEAH");
    this.props.requestImport(
      "/home/dracyr/Music/Albums/Fleet Foxes - Helplessness Blues (2011)/08 - Lorelai.mp3"
    );
  };

  render() {
    return (
      <Fragment>
        <h1 className="header">Importer</h1>
        <div>
          Hej!
          <input
            type="text"
            onChange={event => this.setState({ path: event.target.value })}
          />
          <button onClick={this.importIt}>Import it</button>
          {this.state.path}
          <ul className="importer-album-list">
            {this.props.matchedAlbums.map(album => (
              <li key={album.album_info.album_id}>
                <header className="importer-album-header">
                  <img src="http://placekitten.com/100/100" />
                  <div className="importer-album-header-title">
                    <h2>{album.album_info.album}</h2>
                    <span>{album.album_info.artist}</span>
                  </div>
                </header>
                {this.state.open && (
                  <div className="importer-album-content">
                    <div className="importer-album-tracks">
                      {album.extra_tracks.map(t => (
                        <Track track={t} hideAlbum hideRating />
                      ))}
                    </div>
                    <div className="importer-album-detail">Detail</div>
                  </div>
                )}
                <div
                  className="importer-album-footer"
                  onClick={() => this.setState({ open: !this.state.open })}
                >
                  {this.state.open ? "Hide" : "Show more"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Fragment>
    );
  }
}

const mapProps = state => ({
  album: state.importer.album,
  matchedAlbums: state.importer.matchedAlbums
});

const mapDispatch = dispatch => ({
  requestImport: (...args) => dispatch(RequestImport(...args))
});

export default connect(mapProps, mapDispatch)(Importer);
