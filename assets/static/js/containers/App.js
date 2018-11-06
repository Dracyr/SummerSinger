import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import Folders from "Containers/Folders";
import Player from "Containers/Player";
import Playlist from "Containers/Playlists";
import Queue from "Containers/Queue";
import Search from "Containers/Search";
import Settings from "Containers/Settings";
import Sidebar from "Containers/Sidebar";
import Tracks from "Containers/Tracks";
import Artists from "Containers/Artists";
import Artist from "Containers/Artists/components/Artist";
import Albums from "Containers/Albums";
import Album from "Containers/Albums/components/Album";
import Importer from "Containers/Importer";

const App = () => (
  <Router>
    <Fragment>
      <Player />
      <Sidebar />
      <main id="main-content">
        <Switch>
          <Route path="/queue" component={Queue} />
          <Route path="/search" component={Search} />
          <Route path="/tracks" component={Tracks} />
          <Route path="/artists/:artistId" component={Artist} />
          <Route path="/artists" component={Artists} />
          <Route path="/albums/:albumId" component={Album} />
          <Route path="/albums" component={Albums} />
          <Route path="/folders" component={Folders} />
          <Route path="/settings" component={Settings} />
          <Route path="/playlist/:playlistId" component={Playlist} />
          <Route path="/importer" component={Importer} />
          <Redirect to="/queue" />
        </Switch>
      </main>
    </Fragment>
  </Router>
);

export default App;
