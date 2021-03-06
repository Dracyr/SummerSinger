export const SWITCH_PLAYLIST_VIEW = "SWITCH_PLAYLIST_VIEW";
export const PlaylistViews = {
  SHOW: "SHOW",
  NEW: "NEW",
  UPDATE: "UPDATE"
};

export const REQUEST_PLAYLISTS = "REQUEST_PLAYLISTS";
export const RECEIVE_PLAYLISTS = "RECEIVE_PLAYLISTS";

export const REQUEST_PLAYLIST = "REQUEST_PLAYLIST";
export const RECEIVE_PLAYLIST = "RECEIVE_PLAYLIST";

export const ADD_TRACK_TO_PLAYLIST = "ADD_TRACK_TO_PLAYLIST";

export const PLAY_PLAYLIST = "PLAY_PLAYLIST";
export const QUEUE_PLAYLIST = "QUEUE_PLAYLIST";

export function switchPlaylistView(playlistView) {
  return { type: SWITCH_PLAYLIST_VIEW, playlistView };
}

function requestPlaylists() {
  return { type: REQUEST_PLAYLISTS };
}

export function receivePlaylists(playlists) {
  return { type: RECEIVE_PLAYLISTS, playlists };
}

export function fetchPlaylists() {
  return (dispatch, getState) => {
    if (getState().playlist.playlists.length > 0) {
      return null;
    }

    dispatch(requestPlaylists());

    return fetch("/api/playlists")
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
    const playlist = getState().playlist.playlists.find(
      p => (p.id === playlistId ? p : false)
    );

    if (playlist.tracks) {
      return null;
    }

    dispatch(requestPlaylist(playlistId));

    return fetch(`/api/playlists/${playlistId}`)
      .then(response => response.json())
      .then(json => dispatch(receivePlaylist(json.data)));
  };
}

export function createPlaylist(title) {
  return () => {
    fetch("/api/playlists", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playlist: {
          title
        }
      })
    });
  };
}

export function addTrackToPlaylist(trackId, playlistId) {
  return { type: ADD_TRACK_TO_PLAYLIST, trackId, playlistId };
}

export function playPlaylist(playlistId) {
  return { type: PLAY_PLAYLIST, playlistId };
}

export function queuePlaylist(playlistId) {
  return { type: QUEUE_PLAYLIST, playlistId };
}
