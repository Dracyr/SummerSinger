import React, { PropTypes } from 'react';
import { requestPlayTrack } from '../actions/player';
import { bindActionCreators } from 'redux';

import Player     from '../components/Player';
import Sidebar    from '../components/Sidebar';
import Settings   from '../components/Settings';
import Playlist   from '../components/Playlist';
import Library    from '../components/Library';
import TrackList    from '../components/TrackList';

class Summer extends React.Component {

  render() {
    const {
        actions,
        view,
        currentTrack,
        library,
        queue,
        playlists,
      } = this.props;

    let currentId = currentTrack ? currentTrack.index : '';
    let mainView;
    switch(view) {
      case 'QUEUE':
        mainView = <TrackList tracks={queue}
                    keyAttr={"index"}
                    currentKey={currentId}
                    onClickHandler={(track) => actions.player.requestPlayTrack(track.index)}/>;
        break;
      case 'SETTINGS':
        var settings = {
          'hwPlayback': true,
          'hwVolume': 1
        };
        mainView = <Settings settings={settings}/>;
        break;
      case 'PLAYLIST':
        let playlist = '';
        mainView = <Playlist playlist={playlist}/>;
        break;
      case 'LIBRARY':
        mainView = <Library library={library}
                            fetchLibraryTracks={actions.library.fetchLibraryTracks} />;
        break;
      default:
        mainView = '';
    }

    return (
      <div>
        <Player />
        <div className="wrapper">
          <Sidebar view={view}
                  switchView={actions.views.switchView}
                  playlists={playlists} />
          <div className="main-content">
            {mainView}
          </div>
        </div>
      </div>
    );
  }
}

export default Summer;
