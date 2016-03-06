import React, { PropTypes } from 'react';
import { requestPlayTrack } from '../actions/player';
import { bindActionCreators } from 'redux';

import Player     from '../components/Player';
import Sidebar    from '../components/Sidebar';
import Settings   from '../components/Settings';
import Playlist   from '../components/Playlist';
import Library    from '../components/Library';
import TrackList  from '../components/TrackList';

class Summer extends React.Component {

  render() {
    const {
        actions,
        views,
        player,
        library
      } = this.props;

    const currentPlaylist = library.playlists.find((playlist) => {
      return playlist.id === views.playlist ? playlist : false;
    });

    let mainView;
    const currentId = player.currentTrack ? player.currentTrack.id : '';
    switch(views.view) {
      case 'QUEUE':
        const currentIndex = player.currentTrack ? player.currentTrack.index : '';
        mainView = <TrackList tracks={player.queue}
                    keyAttr={"index"}
                    currentKey={currentIndex}
                    onClickHandler={(track) => actions.player.requestPlayTrack(track.index)}/>;
        break;
      case 'SETTINGS':
        let settings = {
          'hwPlayback': true,
          'hwVolume': 1
        };
        mainView = <Settings settings={settings}/>;
        break;
      case 'PLAYLIST':
        mainView = <Playlist playlist={currentPlaylist}
                            fetchPlaylist={actions.library.fetchPlaylist} />;
        break;
      case 'LIBRARY':

        mainView = (
            <Library library={library}
                    fetchLibrary={actions.library.fetchLibrary}
                    switchLibraryView={actions.views.switchLibraryView}
                    fetchArtistDetails={actions.library.fetchArtistDetails}
                    currentKey={currentId}
                    libraryView={views.libraryView} />
          );
        break;
      case 'SEARCH':
        mainView = <TrackList tracks={library.search}
                    keyAttr={"id"}
                    currentKey={currentId}
                    onClickHandler={(track) => actions.player.requestQueueTrack(track.id)}/>;
        break;
      default:
        mainView = '';
    }

    return (
      <div>
        <Player />
        <div className="wrapper">
          <Sidebar view={views.view}
                  switchView={actions.views.switchView}
                  switchPlaylist={actions.views.switchPlaylist}
                  fetchPlaylists={actions.library.fetchPlaylists}
                  search={actions.library.fetchSearch}
                  playlists={library.playlists}
                  currentPlaylist={currentPlaylist} />
          <div id="main-content">
            {mainView}
          </div>
        </div>
      </div>
    );
  }
}

export default Summer;
