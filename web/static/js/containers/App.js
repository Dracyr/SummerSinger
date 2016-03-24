import React from 'react';
import { connect } from 'react-redux';

import Player   from '../app/Player/Player';
import Sidebar  from '../app/Sidebar/Sidebar';
import Settings from '../app/Settings/Settings';
import Playlist from '../app/Playlist/Playlist';
import Library  from '../app/Library/Library';
import Search   from '../app/Search/Search';
import Queue    from '../app/Queue/Queue';

const mainView = (view) => {
  switch (view) {
    case 'QUEUE':
      return <Queue />;
    case 'SETTINGS':
      return <Settings />;
    case 'PLAYLIST':
      return <Playlist />;
    case 'LIBRARY':
      return <Library />;
    case 'SEARCH':
      return <Search />;
    default:
      return '';
  }
};

const App = (props) => {
  const view = mainView(props.view);

  return (
    <div>
      <Player />
      <div className="wrapper">
        <Sidebar />
        <div id="main-content">
          {view}
        </div>
      </div>
    </div>
  );
};

function mapState(state) {
  return {
    view: state.views.view,
  };
}

export default connect(mapState)(App);
