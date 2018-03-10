import { RECEIVE_LIBRARY, RECEIVE_SEARCH, SORT_LIBRARY } from "./actions";

import { TRACK_UPDATE } from "Containers/Tracks/actions";
import { insertAtOffset } from "Util";

const initialLibrary = {
  librarySort: { sortBy: "title", dir: "asc" },
  totalTracks: 0,
  tracks: [],
  totalAlbums: 0,
  albums: [],
  totalArtists: 0,
  artists: [],
  playlists: [],
  search: []
};

const recieveLibrary = (
  state,
  libraryType,
  libraryTracks,
  fullUpdate,
  total,
  offset = 0
) => {
  switch (libraryType) {
    case "tracks":
      if (fullUpdate) {
        return { ...state, tracks: libraryTracks, totalTracks: total };
      }

      return {
        ...state,
        tracks: insertAtOffset(state.tracks, libraryTracks, offset),
        totalTracks: total
      };
    case "albums":
      if (fullUpdate) {
        return { ...state, albums: libraryTracks, totalAlbums: total };
      }

      return {
        ...state,
        albums: insertAtOffset(state.albums, libraryTracks, offset),
        totalAlbums: total
      };
    case "artists":
      if (fullUpdate) {
        return { ...state, artists: libraryTracks, totalArtists: total };
      }

      return {
        ...state,
        artists: insertAtOffset(state.artists, libraryTracks, offset),
        totalArtists: total
      };
    default:
      return state;
  }
};

export default function library(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_LIBRARY:
      return recieveLibrary(
        state,
        action.libraryType,
        action.library,
        action.full,
        action.total,
        action.offset
      );
    case RECEIVE_SEARCH:
      return { ...state, search: action.search };
    case SORT_LIBRARY:
      return { ...state, librarySort: action.sort, tracks: [] };
    case TRACK_UPDATE:
      return {
        ...state,
        tracks: state.tracks.map(
          track => (action.track.id === track.id ? action.track : track)
        )
      };
    default:
      return state;
  }
}
