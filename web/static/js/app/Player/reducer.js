import { SOCKET_STATUS_UPDATE, QUEUE_UPDATE } from './actions';

const initialPlayer = {
  playing: false,
  currentTrack: null,
  serverTime: null,
  queueIndex: null,
  startTime: null,
  pausedDuration: null,
  queue: [],
};

export default function player(state = initialPlayer, action) {
  let currentTrack;
  switch (action.type) {
    case SOCKET_STATUS_UPDATE:
      currentTrack = state.queue[action.statusUpdate.queue_index] || null;
      const normalizedStartTime = (Date.now() - action.statusUpdate.current_time) + action.statusUpdate.start_time;
      return {
        ...state,
        playing: action.statusUpdate.playback,
        currentTrack: currentTrack,
        queueIndex: action.statusUpdate.queue_index,
        startTime: normalizedStartTime,
        pausedDuration: action.statusUpdate.paused_duration,
        serverTime: action.statusUpdate.current_time
      };
    case QUEUE_UPDATE:
      console.log("queue_update");
      currentTrack = action.queue[state.queueIndex] || null;
      return { ...state, queue: action.queue, currentTrack: currentTrack };
    default:
      return state;
  }
}
