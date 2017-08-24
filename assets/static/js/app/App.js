import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Player   from '../app/Player/Player';
import Sidebar  from '../app/Sidebar/Sidebar';
import Settings from '../app/Settings/Settings';
import Library  from '../app/Library/Library';
import Tracks   from '../app/Track/Tracks';
import Artists  from '../app/Artist/Artists';
import Artist   from '../app/Artist/Artist';
import Albums   from '../app/Album/Albums';
import Album    from '../app/Album/Album';
import Folders  from '../app/Folders/Folders';
import Search   from '../app/Search/Search';
import Queue    from '../app/Queue/Queue';
import Inbox    from '../app/Inbox/Inbox';
import PlaylistView from '../app/Playlist/PlaylistView';

const App = () => (
  <Router>
    <div>
      {/*<Player />*/}
      <div className="wrapper">
        <Sidebar />
        <div id="main-content">
          <Switch>
            <Route path="/queue" component={Queue} />
            <Route path="/search" component={Search} />
            <Route path="/inbox" component={Inbox} />
            <Route path="/tracks" component={Tracks} />
            <Route path="/artists/:artistId" component={Artist} />
            <Route path="/artists" component={Artists} />
            <Route path="/albums/:albumId" component={Album} />
            <Route path="/albums" component={Albums} />
            <Route path="/library" component={Library} />
            <Route path="/folders" component={Folders} />
            <Route path="/settings" component={Settings} />
            <Route path="/playlist/:playlistId" component={PlaylistView} />
            <Redirect to="/queue" />
          </Switch>
        </div>
      </div>
    </div>
  </Router>
);

export default App;
