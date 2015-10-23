import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as GrooveActions from '../actionCreators';
import { bindActionCreators } from 'redux';

import Player     from '../components/Player';
import Sidebar    from '../components/Sidebar';
import Queue      from '../components/Queue';
import Settings   from '../components/Settings';
import Playlist   from '../components/Playlist';
import Library   from '../components/Library';

class GrooveApp extends React.Component {

  render() {
    const {
        actions,
        view,
        playing,
        streaming,
        statusUpdate,
        track,
        grooveSocket,
        dispatch,
        library,
        queue
      } = this.props;

    let currentId = statusUpdate ? statusUpdate.currentItemId : '';
    let mainView;
    switch(view) {
      case 'QUEUE':
        mainView = <Queue queueItems={queue} currentId={currentId}/>;
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
        mainView = <Library
                      library={library}
                      currentId={currentId}
                      dispatch={dispatch}
                      grooveSocket={grooveSocket} />;
        break;
      default:
        mainView = '';
    }

    return (
      <div>
        <Player
          actions={actions}
          playing={playing}
          streaming={streaming}
          statusUpdate={statusUpdate}
          track={track}
          grooveSocket={grooveSocket} />
        <div className="wrapper">
          <Sidebar view={view} switchView={actions.switchView}/>
          <div className="main-content">
            {mainView}
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    view: state.default.view,
    playing: state.default.playing,
    streaming: state.default.streaming,
    statusUpdate: state.default.statusUpdate,
    track: state.default.track,
    library: state.default.library,
    queue: state.default.queue
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(GrooveActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(GrooveApp);
