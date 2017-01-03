import {
  SWITCH_LIBRARY_VIEW,
  RECEIVE_LIBRARY,
  RECEIVE_SEARCH,
  SORT_LIBRARY,
} from './actions';

import { TRACK_UPDATE } from '../Track/actions';

const initialLibrary = {
  libraryView: 'TRACKS',
  librarySort: { sortBy: 'title', dir: 'asc' },
  totalTracks: 0,
  tracks: [],
  totalAlbums: 0,
  albums: [],
  totalArtists: 0,
  artists: [],
  playlists: [],
  search: [],
};

const recieveLibrary = (state, libraryType, libraryTracks, fullUpdate, total) => {
  switch (libraryType) {
    case 'tracks':
      const tracks = fullUpdate ? libraryTracks : [...state.tracks, ...libraryTracks];
      return { ...state, tracks, totalTracks: total };
    case 'albums':
      const albums = fullUpdate ? libraryTracks : [...state.albums, ...libraryTracks];
      return { ...state, albums, totalAlbums: total };
    case 'artists':
      const artists = fullUpdate ? libraryTracks : [...state.artists, ...libraryTracks];
      return { ...state, artists, totalArtists: total };
    default:
      return state;
  }
};

export default function library(state = initialLibrary, action) {
  switch (action.type) {
    case SWITCH_LIBRARY_VIEW:
      return { ...state, libraryView: action.libraryView };
    case RECEIVE_LIBRARY:
      return recieveLibrary(state, action.libraryType, action.library, action.full, action.total);
    case RECEIVE_SEARCH:
      return { ...state, search: action.search };
    case SORT_LIBRARY:
      return { ...state, librarySort: action.sort, tracks: [] };
    case TRACK_UPDATE:
      return { ...state,
        tracks: state.tracks.map(track =>
          action.track.id === track.id ? action.track : track
        ),
      };
    default:
      return state;
  }
}
