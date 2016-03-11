import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/player';
import * as LibraryActions from '../actions/library';
import * as ViewsActions from '../actions/views';
import _ from 'lodash';

import { switchLibraryView } from '../actions/library';
import { requestQueueTrack } from '../actions/player';
import TrackList from './TrackList';
import AlbumList from './AlbumList';
import ArtistList from './ArtistList';

class Library extends Component {
  constructor() {
    super();
    this.loadMoreTracks = _.throttle(this.loadMoreRows, 50);
  }

  componentDidMount() {
    this.props.actions.fetchLibrary(this.props.libraryView.toLowerCase(), 0, 50);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.libraryView !== this.props.libraryView) {
      const view = this.props.libraryView.toLowerCase();
      const collection = this.props[view];
      if (collection.length < 50) {
        this.props.actions.fetchLibrary(view, 0, 50);
      }
    }
  }

  loadMoreRows(type, from, size) {
    const count = this.props[type].length;
    this.props.actions.fetchLibrary(type, count, size);
  }

  render() {
    const { tracks, albums, artists, libraryView, actions, total, currentKey } = this.props;

    const libraryHeader = (
      <div>
        <h1 className="library-header">
          <span onClick={() => actions.switchLibraryView('TRACKS')} className={libraryView == 'TRACKS' ? '' : 'inactive'}>Tracks </span>
          <span onClick={() => actions.switchLibraryView('ALBUMS')} className={libraryView == 'ALBUMS' ? '' : 'inactive'}>Albums </span>
          <span onClick={() => actions.switchLibraryView('ARTISTS')} className={libraryView == 'ARTISTS' ? '' : 'inactive'}>Artists </span>
        </h1>
      </div>
    );

    let currentView = '';
    switch(libraryView) {
      case 'TRACKS':
        currentView = <TrackList
          tracks={tracks}
          totalTracks={total.tracks}
          keyAttr={"id"}
          currentKey={currentKey}
          loadMoreRows={(offset, size) => this.loadMoreRows('tracks', offset, size)}
          onClickHandler={(track) => requestQueueTrack(track.id)} />;
        break;
      case 'ALBUMS':
        currentView = <AlbumList
                        albums={albums}
                        totalAlbums={total.albums}
                        loadMoreRows={(offset, size) => this.loadMoreRows('albums', offset, size)} />;
        break;
      case 'ARTISTS':
        currentView = <ArtistList
                        artists={artists}
                        currentKey={currentKey}
                        totalArtists={total.artists}
                        loadMoreRows={(offset, size) => this.loadMoreRows('artists', offset, size)} />;
        break;
    }

    return (
      <div>
        {libraryHeader}
        {currentView}
      </div>
    );
  }
}

function mapState(state) {
  return {
    libraryView: state.library.libraryView,
    tracks: state.library.tracks,
    albums: state.library.albums,
    artists: state.library.artists,
    total: {
      tracks: state.library.totalTracks,
      albums: state.library.totalAlbums,
      artists: state.library.totalArtists
    }
  };
}

function mapDispatch(dispatch) {
  return {
    actions:  bindActionCreators(LibraryActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(Library);
