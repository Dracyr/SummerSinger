import {
  RECEIVE_ALBUM,
} from './actions';

const initialLibrary = {
  album: null,
};

export default function albums(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_ALBUM:
      return { ...state, album: action.album };
    default:
      return state;
  }
}
