import fetch from 'isomorphic-fetch';

export const REQUEST_LIBRARY_TRACKS = 'REQUEST_LIBRARY_TRACKS';
export const RECEIVE_LIBRARY_TRACKS = 'RECEIVE_LIBRARY_TRACKS';
export const REQUEST_PLAYLISTS = 'REQUEST_PLAYLISTS';
export const RECEIVE_PLAYLISTS = 'RECEIVE_PLAYLISTS';

function requestLibraryTracks() {
  return { type: REQUEST_LIBRARY_TRACKS };
}

function receiveLibraryTracks(tracks) {
  return { type: RECEIVE_LIBRARY_TRACKS, tracks };
}

export function fetchLibraryTracks() {
  return (dispatch, getState) => {
    if (getState().library.tracks.length > 0) {
      return;
    }

    dispatch(requestLibraryTracks());

    return fetch('http://localhost:4000/api/tracks')
      .then(response => response.json())
      .then(json => dispatch(receiveLibraryTracks(json.data)));
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
