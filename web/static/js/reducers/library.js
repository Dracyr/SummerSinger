import {
  RECEIVE_LIBRARY,
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  RECEIVE_SEARCH
} from '../actions/library';

const initialLibrary = {
  tracks: [],
  albums: [],
  artists: [],
  playlists: [],
  search: []
};

export default function library(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_LIBRARY:
      const libraryState = {};
      libraryState[action.libraryType] = action.library;
      return Object.assign({}, state, libraryState);
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
    case RECEIVE_SEARCH:
      return { ...state, search: action.search };
    default:
      return state;
  }
}
