import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PlayerActions from '../Player/actions';
import * as LibraryActions from './actions';

import InfiniteTrackList from '../Track/InfiniteTrackList';
import { InfiniteAlbumList } from '../Album/AlbumList';
import Album from '../Album/Album';
import Artist from '../Artist/Artist';
import InfiniteArtistList from '../Artist/InfiniteArtistList';
import Folders from '../Folders/Folders';

class Library extends Component {
  constructor() {
    super();
    this.loadMoreRows = this.loadMoreRows.bind(this);
    this.sortTracks = this.sortTracks.bind(this);
  }

  componentDidMount() {
    if (this.props.libraryView !== 'FOLDERS') {
      this.props.actions.fetchLibrary(this.props.libraryView.toLowerCase(), 0, 50);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.libraryView !== 'FOLDERS' &&
        prevProps.libraryView !== this.props.libraryView) {
      const view = this.props.libraryView.toLowerCase();
      const collection = this.props[view];
      if (collection && collection.length < 50) {
        this.props.actions.fetchLibrary(view, 0, 50);
      }
    }
  }

  loadMoreRows(type, first, size) {
    this.props.actions.fetchLibrary(type, first, size);
  }

  sortTracks(sort) {
    this.props.actions.sortLibrary(sort);
  }

  render() {
    const {
      tracks,
      albums,
      artists,
      currentId,
      total,
      libraryView,
      librarySort,
      actions,
      showItem,
    } = this.props;

    const libraryHeader = (
      <h1 className="header">
        <span
          onClick={() => actions.switchLibraryView('TRACKS')}
          className={libraryView === 'TRACKS' ? '' : 'inactive'}
        >
          Tracks
        </span>
        <span
          onClick={() => actions.switchLibraryView('ALBUMS')}
          className={libraryView === 'ALBUMS' ? '' : 'inactive'}
        >
          Albums
        </span>
        <span
          onClick={() => actions.switchLibraryView('ARTISTS')}
          className={libraryView === 'ARTISTS' ? '' : 'inactive'}
        >
          Artists
        </span>
        <span
          onClick={() => actions.switchLibraryView('FOLDERS')}
          className={libraryView === 'FOLDERS' ? '' : 'inactive'}
        >
          Folders
        </span>
      </h1>
    );

    let currentView = '';

    switch (libraryView) {
      case 'TRACKS':
        currentView = (
          <InfiniteTrackList
            entries={tracks}
            totalTracks={total.tracks}
            keyAttr={'id'}
            currentKey={currentId}
            sortTracks={this.sortTracks}
            sort={librarySort}
            loadMoreRows={(offset, size) => this.loadMoreRows('tracks', offset, size)}
            onClickHandler={track => actions.requestQueueAndPlayTrack(track.id)}
          />);
        break;
      case 'ALBUMS':
        currentView = (
          <InfiniteAlbumList
            entries={albums}
            totalAlbums={total.albums}
            onClickHandler={album => actions.switchLibraryView('SHOW_ALBUM', album.id)}
            loadMoreRows={(offset, size) => this.loadMoreRows('albums', offset, size)}
          />);
        break;
      case 'ARTISTS':
        currentView = (
          <InfiniteArtistList
            entries={artists}
            currentKey={currentId}
            totalArtists={total.artists}
            onClickHandler={artist => actions.switchLibraryView('SHOW_ARTIST', artist.id)}
            loadMoreRows={(offset, size) => this.loadMoreRows('artists', offset, size)}
          />);
        break;
      case 'FOLDERS':
        currentView = <Folders />;
        break;
      case 'SHOW_ALBUM':
        currentView = (
          <Album
            album={albums.find(el => el && el.id === showItem)}
            currentId={currentId}
            onClickHandler={track => actions.requestQueueAndPlayTrack(track.id)}
          />);
        break;
      case 'SHOW_ARTIST':
        currentView = (
          <Artist
            artist={artists.find(el => el && el.id === showItem)}
            currentId={currentId}
            onClickHandler={track => actions.requestQueueAndPlayTrack(track.id)}
          />);
        break;
      default:
        currentView = '';
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
    currentId: state.player.currentTrack ? state.player.currentTrack.id : null,
    libraryView: state.library.libraryView,
    showItem: state.library.showItem,
    librarySort: state.library.librarySort,
    tracks: state.library.tracks,
    albums: state.library.albums,
    artists: state.library.artists,
    total: {
      tracks: state.library.totalTracks,
      albums: state.library.totalAlbums,
      artists: state.library.totalArtists,
    },
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, LibraryActions, PlayerActions), dispatch),
  };
}

export default connect(mapState, mapDispatch)(Library);
