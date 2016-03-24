import React from 'react';
import { connect } from 'react-redux';

import Player   from '../components/Player';
import Sidebar  from '../components/Sidebar';
import Settings from '../components/Settings';
import Playlist from '../components/Playlist';
import Library  from '../components/Library';
import Search   from '../components/Search';
import Queue    from '../components/Queue';

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
