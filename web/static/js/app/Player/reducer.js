import { SOCKET_STATUS_UPDATE, QUEUE_UPDATE } from './actions';

const initialPlayer = {
  playing: false,
  currentTrack: null,
  serverTime: null,
  queueIndex: null,
  startTime: null,
  pausedDuration: null,
  queue: [],
  volume: 100,
};

export default function player(state = initialPlayer, action) {
  switch (action.type) {
    case SOCKET_STATUS_UPDATE: {
      const normalizedStartTime = action.statusUpdate.start_time +
        (Date.now() - action.statusUpdate.current_time);

      return { ...state,
        playing: action.statusUpdate.playback,
        queueIndex: action.statusUpdate.queue_index,
        startTime: normalizedStartTime,
        pausedDuration: action.statusUpdate.paused_duration,
        serverTime: action.statusUpdate.current_time,
        currentTrack: state.queue[action.statusUpdate.queue_index] || null,
        volume: action.volume,
      };
    }
    case QUEUE_UPDATE:
      return { ...state,
        currentTrack: action.queue[state.queueIndex] || null,
        queue: action.queue,
      };
    default:
      return state;
  }
}
