import {
  SWITCH_PLAYLIST_VIEW,
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
} from './actions';

const initialPlaylists = {
  playlistView: 'SHOW',
  playlists: [],
};

export default function playlist(state = initialPlaylists, action) {
  switch (action.type) {
    case SWITCH_PLAYLIST_VIEW:
      return { ...state, playlistView: action.playlistView };
    case RECEIVE_PLAYLISTS:
      return { ...state, playlists: action.playlists };
    case RECEIVE_PLAYLIST:
      const playlists = state.playlists.map((playlist) => {
        if (playlist.id === action.playlist.id) {
          return { ...playlist, tracks: action.playlist.tracks };
        }
        return playlist;
      });
      return { ...state, playlists };
    default:
      return state;
  }
}
