import React from 'react';
import { connect } from 'react-redux';

import Player   from '../app/Player/Player';
import Sidebar  from '../app/Sidebar/Sidebar';
import Settings from '../app/Settings/Settings';
import Library  from '../app/Library/Library';
import Search   from '../app/Search/Search';
import Queue    from '../app/Queue/Queue';
import Inbox    from '../app/Inbox/Inbox';
import PlaylistView from '../app/Playlist/PlaylistView';

const mainView = (view) => {
  switch (view) {
    case 'QUEUE':
      return <Queue />;
    case 'SETTINGS':
      return <Settings />;
    case 'PLAYLIST':
      return <PlaylistView />;
    case 'LIBRARY':
      return <Library />;
    case 'SEARCH':
      return <Search />;
    case 'INBOX':
      return <Inbox />;
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
