import { combineReducers } from 'redux';
import * as actions from './actions';

const initialState = {
  view: 'QUEUE',
  playing: false,
  current_track: null,
  queue_index: null,
  library: [],
  queue: [],
};

function grooveReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SWITCH_VIEW:
      return { ...state, view: action.view };
    case actions.SOCKET_STATUS_UPDATE:
      let current_track = state.queue[action.statusUpdate.queue_index] || null;
      return {
        ...state,
        playing: action.statusUpdate.playback,
        current_track: current_track,
        queue_index: action.statusUpdate.queue_index
      };
    case actions.RECEIVE_LIBRARY:
      return { ...state, library: action.library };
    case actions.QUEUE_UPDATE:
      return { ...state, queue: action.queue };
    default:
      return state;
  }
}

export default grooveReducer;
