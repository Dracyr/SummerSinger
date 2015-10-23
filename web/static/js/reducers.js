import { combineReducers } from 'redux';
import * as actions from './actions';

const initialState = {
  view: 'QUEUE',
  playing: false,
  streaming: false,
  statusUpdate: null,
  library: null,
  libraryVersion: '',
  track: null
};

function grooveReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SWITCH_VIEW:
      return { ...state, view: action.view };

    case actions.SET_PLAYING:
      return { ...state, playing: action.playing };

    case actions.SET_STREAMING:
      return { ...state, streaming: action.streaming };

    case actions.SOCKET_CURRENT_TRACK:
      let statusUpdate = action.track;
      return {
        ...state,
        statusUpdate: statusUpdate,
        playing: statusUpdate.isPlaying,
        track: state.library ? state.library[statusUpdate.trackKey] : state.track
      };

    case actions.SOCKET_LIBRARY_UPDATE:
      let update = action.update;
      let newState = {
        ...state,
        libraryVersion: update.version,
        library: update.reset ? update.delta : state.library
      };

      // if (update.reset) {
      //   this.state.queue.setLibrary(library.delta);
      // }

      if (state.track === null && state.statusUpdate !== null) {
        newState.track = newState.library[state.statusUpdate.trackKey];
      }

      return newState;
    case actions.RECEIVE_LIBRARY:
      console.log("in reducers");
      return { ...state, library: action.library };
    default:
      return state;
  }
}

// const rootReducer = combineReducers({
//   grooveReducer
// });

export default grooveReducer;
