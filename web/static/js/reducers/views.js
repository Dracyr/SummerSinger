import {
  SWITCH_VIEW,
  SWITCH_PLAYLIST,
  SWITCH_LIBRARY_VIEW
} from '../actions/views';

const initialState = {
  view: 'QUEUE',
  playlist: null,
  libraryView: 'TRACKS'
};

export default function views(state = initialState, action) {
  switch (action.type) {
    case SWITCH_VIEW:
      return { ...state, view: action.view };
    case SWITCH_PLAYLIST:
      return { ...state, view: 'PLAYLIST', playlist: action.playlist };
    case SWITCH_LIBRARY_VIEW:
      return { ...state, libraryView: action.libraryView };
    default:
      return state;
  }
}
