import {
  SWITCH_PLAYLIST_VIEW,
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST
} from "./actions";

const initialPlaylists = {
  playlistView: "SHOW",
  playlists: []
};

export default function reducer(state = initialPlaylists, action) {
  switch (action.type) {
    case SWITCH_PLAYLIST_VIEW:
      return { ...state, playlistView: action.playlistView };
    case RECEIVE_PLAYLISTS:
      return { ...state, playlists: action.playlists };
    case RECEIVE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map(
          playlist =>
            playlist.id === action.playlist.id
              ? { ...playlist, tracks: action.playlist.tracks }
              : playlist
        )
      };
    default:
      return state;
  }
}
