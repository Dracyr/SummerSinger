import {
  TOGGLE_CREATE_PLAYLIST,
} from './actions';

const initialSidebar = {
  showCreatePlaylist: false,
};

export default function playlist(state = initialSidebar, action) {
  switch (action.type) {
    case TOGGLE_CREATE_PLAYLIST:
      return { ...state, showCreatePlaylist: !state.showCreatePlaylist };
    default:
      return state;
  }
}
