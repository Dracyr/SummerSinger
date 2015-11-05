import { combineReducers } from 'redux';
import * as actions from './actions';

const initialState = {
  view: 'QUEUE',
  playing: false,
  currentTrack: null,
  queueIndex: null,
  startTime: null,
  pausedTime: null,
  duration: null,
  library: [],
  queue: [],
};

function grooveReducer(state = initialState, action) {
  let currentTrack;

  switch (action.type) {
    case actions.SWITCH_VIEW:
      return { ...state, view: action.view };
    case actions.SOCKET_STATUS_UPDATE:
      currentTrack = state.queue[action.statusUpdate.queue_index] || null;
      return {
        ...state,
        playing: action.statusUpdate.playback,
        currentTrack: currentTrack,
        queueIndex: action.statusUpdate.queue_index,
        startTime: action.statusUpdate.start_time,
        pausedTime: action.statusUpdate.paused_time,
        duration: action.statusUpdate.duration
      };
    case actions.RECEIVE_LIBRARY:
      return { ...state, library: action.library };
    case actions.QUEUE_UPDATE:
      currentTrack = action.queue[state.queueIndex] || null;
      return { ...state, queue: action.queue, currentTrack: currentTrack };
    default:
      return state;
  }
}

export default grooveReducer;
