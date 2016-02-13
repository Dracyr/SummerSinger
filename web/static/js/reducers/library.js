import {
  RECEIVE_LIBRARY_TRACKS,
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST
} from '../actions/library';

const initialLibrary = {
  tracks: [],
  albums: [],
  artists: [],
  playlists: []
};

export default function library(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_LIBRARY_TRACKS:
      return { ...state, tracks: action.tracks };
    case RECEIVE_PLAYLISTS:
      return { ...state, playlists: action.playlists };
    case RECEIVE_PLAYLIST:
      let playlists = state.playlists.map((playlist) => {
        if (playlist.id === action.playlist.id) {
          return { ...playlist, tracks: action.playlist.tracks };
        }
        return playlist;
      });
      return { ...state, playlists: playlists };
    default:
      return state;
  }
}
