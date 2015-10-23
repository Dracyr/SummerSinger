import { combineReducers } from 'redux';
import * as actions from './actions';

const initialState = {
  view: 'QUEUE',
  playing: false,
  streaming: false,
  statusUpdate: null,
  library: [],
  libraryVersion: '',
  queue: [],
  track: null
};

function grooveReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SWITCH_VIEW:
      return { ...state, view: action.view };
    case actions.SOCKET_STATUS_UPDATE:
      let status = action.status;
      return {
        ...state,
        playing: status.playback
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
