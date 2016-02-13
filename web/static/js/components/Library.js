import React, { Component } from 'react';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import { requestQueueTrack } from '../actions/player';
import TrackList from './TrackList';
import AlbumList from './AlbumList';
import ArtistList from './ArtistList';




class Library extends Component {
  componentDidMount() {
    this.props.fetchLibrary('tracks');
    this.props.fetchLibrary('albums');
    this.props.fetchLibrary('artists');
  }

  render() {
    const { library, libraryView, switchLibraryView, fetchArtistDetails } = this.props;
    console.log(libraryView);

    return (
      <Tabs value={libraryView}>
        <Tab label="Tracks"
            value="TRACKS"
            onClick={() => switchLibraryView('TRACKS')}>
          <TrackList tracks={library.tracks}
                      keyAttr={"id"}
                      onClickHandler={(track) => requestQueueTrack(track.id)} />
        </Tab>
        <Tab label="Albums"
            value="ALBUMS"
            onClick={() => switchLibraryView('ALBUMS')}>
          <AlbumList albums={library.albums} />;
        </Tab>
        <Tab label="Artists"
            value="ARTISTS"
            onClick={() => switchLibraryView('ARTISTS')}>
          <ArtistList artists={library.artists} fetchArtistDetails={fetchArtistDetails} />
        </Tab>
      </Tabs>
    );
  }
}

export default Library;
