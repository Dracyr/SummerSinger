import fetch from 'isomorphic-fetch';

export const SWITCH_LIBRARY_VIEW = 'SWITCH_LIBRARY_VIEW';

export const REQUEST_LIBRARY = 'REQUEST_LIBRARY';
export const RECEIVE_LIBRARY  = 'RECEIVE_LIBRARY';

export const REQUEST_PLAYLISTS = 'REQUEST_PLAYLISTS';
export const RECEIVE_PLAYLISTS = 'RECEIVE_PLAYLISTS';

export const REQUEST_PLAYLIST = 'REQUEST_PLAYLIST';
export const RECEIVE_PLAYLIST = 'RECEIVE_PLAYLIST';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';

export const LibraryViews = {
  TRACKS: 'TRACKS',
  ARTISTS: 'ARTISTS',
  ALBUMS: 'ALBUMS'
};

export function switchLibraryView(libraryView) {
  return { type: SWITCH_LIBRARY_VIEW, libraryView };
}

function requestLibrary(libraryType, requested) {
  return { type: REQUEST_LIBRARY, libraryType: libraryType, requested: requested };
}

function receiveLibrary(libraryType, full = true, total, library) {
  return { type: RECEIVE_LIBRARY, libraryType: libraryType, full: full, total: total, library };
}

export function fetchLibrary(libraryType, offset = 0, limit = 0) {
  return (dispatch, getState) => {
    const total = offset + limit;
    if (getState().library[libraryType].length >= total) {
      return;
    }

    dispatch(requestLibrary(libraryType, total));

    const full = total === 0;
    const query = full ? '' : '?offset=' + offset + '&limit=' + limit;
    return fetch('http://localhost:4000/api/' + libraryType + query)
      .then(response => response.json())
      .then(json => dispatch(receiveLibrary(libraryType, full, json.total, json.data)));
  };
}

function requestPlaylists() {
  return { type: REQUEST_PLAYLISTS };
}

function receivePlaylists(playlists) {
  return { type: RECEIVE_PLAYLISTS, playlists };
}

export function fetchPlaylists() {
  return (dispatch, getState) => {
    if (getState().library.playlists.length > 0) {
      return;
    }

    dispatch(requestPlaylists());

    return fetch('http://localhost:4000/api/playlists')
      .then(response => response.json())
      .then(json => dispatch(receivePlaylists(json.data)));
  };
}

function requestPlaylist(playlist_id) {
  return { type: REQUEST_PLAYLIST, playlist_id };
}

function receivePlaylist(playlist) {
  return { type: RECEIVE_PLAYLIST, playlist };
}

export function fetchPlaylist(playlist_id) {
  return (dispatch, getState) => {
    const playlist = getState().library.playlists.find((playlist) => {
      return playlist.id === playlist_id ? playlist : false;
    });

    if (playlist.tracks && playlist.tracks.length > 0) {
      return;
    }

    dispatch(requestPlaylist(playlist_id));

    return fetch('http://localhost:4000/api/playlists/' + playlist_id)
      .then(response => response.json())
      .then(json => dispatch(receivePlaylist(json.data)));
  };
}

function requestSearch(search_term) {
  return { type: REQUEST_SEARCH, search_term };
}

function receiveSearch(search) {
  return { type: RECEIVE_SEARCH, search };
}

export function fetchSearch(search_term) {
  return (dispatch, getState) => {

    dispatch(requestSearch(search_term));

    return fetch('http://localhost:4000/api/tracks?search=' + search_term)
      .then(response => response.json())
      .then(json => dispatch(receiveSearch(json.data)));
  };
}
