import {
  RECEIVE_ARTIST,
} from './actions';

const initialLibrary = {
  artist: null,
};

export default function artists(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_ARTIST:
      return { ...state, artist: action.artist };
    default:
      return state;
  }
}
