import { RECEIVE_LIBRARY_TRACKS, RECEIVE_PLAYLISTS } from '../actions/library';

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
    default:
      return state;
  }
}
