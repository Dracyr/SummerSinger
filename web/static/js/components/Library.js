import React, { Component } from 'react';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import { requestQueueTrack } from '../actions/player';
import TrackList from './TrackList';
import AlbumList from './AlbumList';
import ArtistList from './ArtistList';

class Library extends Component {
  componentDidMount() {
    this.props.fetchLibrary(this.props.libraryView.toLowerCase());
  }

  componentDidUpdate() {
    this.props.fetchLibrary(this.props.libraryView.toLowerCase());
  }

  render() {
    const { library, libraryView, switchLibraryView, currentKey } = this.props;

    const libraryHeader = (
      <div>
        <h1 className="library-header">
          <span onClick={() => switchLibraryView('TRACKS')} className={libraryView == 'TRACKS' ? '' : 'inactive'}>Tracks </span>
          <span onClick={() => switchLibraryView('ALBUMS')} className={libraryView == 'ALBUMS' ? '' : 'inactive'}>Albums </span>
          <span onClick={() => switchLibraryView('ARTISTS')} className={libraryView == 'ARTISTS' ? '' : 'inactive'}>Artists </span>
        </h1>
      </div>
    );

    let currentView = '';
    switch(libraryView) {
      case 'TRACKS':
        currentView = <TrackList
          tracks={library.tracks}
          keyAttr={"id"}
          currentKey={currentKey}
          onClickHandler={(track) => requestQueueTrack(track.id)} />;
        break;
      case 'ALBUMS':
        currentView = <AlbumList albums={library.albums} />;
        break;
      case 'ARTISTS':
        currentView = <ArtistList artists={library.artists} currentKey={currentKey} />;
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

export default Library;
