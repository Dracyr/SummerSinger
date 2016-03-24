import fetch from 'isomorphic-fetch';

export const SWITCH_PLAYLIST_VIEW = 'SWITCH_PLAYLIST_VIEW';

export const REQUEST_PLAYLISTS = 'REQUEST_PLAYLISTS';
export const RECEIVE_PLAYLISTS = 'RECEIVE_PLAYLISTS';

export const REQUEST_PLAYLIST = 'REQUEST_PLAYLIST';
export const RECEIVE_PLAYLIST = 'RECEIVE_PLAYLIST';

export const PlaylistViews = {
  SHOW: 'SHOW',
  NEW: 'NEW',
  UPDATE: 'UPDATE',
};

export function switchPlaylistView(PlaylistView) {
  return { type: SWITCH_PLAYLIST_VIEW, PlaylistView };
}

function requestPlaylists() {
  return { type: REQUEST_PLAYLISTS };
}

function receivePlaylists(playlists) {
  return { type: RECEIVE_PLAYLISTS, playlists };
}

export function fetchPlaylists() {
  return (dispatch, getState) => {
    if (getState().playlist.playlists.length > 0) {
      return null;
    }

    dispatch(requestPlaylists());

    return fetch('/api/playlists')
      .then(response => response.json())
      .then(json => dispatch(receivePlaylists(json.data)));
  };
}

function requestPlaylist(playlistId) {
  return { type: REQUEST_PLAYLIST, playlistId };
}

function receivePlaylist(playlist) {
  return { type: RECEIVE_PLAYLIST, playlist };
}

export function fetchPlaylist(playlistId) {
  return (dispatch, getState) => {
    const playlist = getState().playlist.playlists.find((playlist) => {
      return playlist.id === playlistId ? playlist : false;
    });

    if (playlist.tracks) {
      return null;
    }

    dispatch(requestPlaylist(playlistId));

    return fetch(`/api/playlists/${playlistId}`)
      .then(response => response.json())
      .then(json => dispatch(receivePlaylist(json.data)));
  };
}
