import {
  SWITCH_LIBRARY_VIEW,
  REQUEST_LIBRARY,
  RECEIVE_LIBRARY,
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  RECEIVE_SEARCH
} from '../actions/library';

const initialLibrary = {
  libraryView: 'TRACKS',
  totalTracks: 0,
  requestedTracks: 0,
  tracks: [],
  totalAlbums: 0,
  requestedAlbums: 0,
  albums: [],
  totalArtists: 0,
  requestedArtists: 0,
  artists: [],
  playlists: [],
  search: []
};

export default function library(state = initialLibrary, action) {
  switch (action.type) {
    case SWITCH_LIBRARY_VIEW:
      return { ...state, libraryView: action.libraryView };
    case RECEIVE_LIBRARY:
      return recieveLibrary(state, action.libraryType, action.library, action.offset, action.total);
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

const recieveLibrary = (state, libraryType, library, fullUpdate, total) => {
  switch (libraryType) {
    case 'tracks':
      const tracks = fullUpdate ? library : [...state.tracks, ...library];
      return {...state, tracks: tracks, totalTracks: total};
    case 'albums':
      const albums = fullUpdate ? library : [...state.albums, ...library];
      return {...state, albums: albums, totalAlbums: total};
    case 'artists':
      const artists = fullUpdate ? library : [...state.artists, ...library];
      return {...state, artists: artists, totalArtists: total};
  }
};
