import { QUEUE_UPDATE } from './actions';

const initialQueue = {
  queue: [],
};

export default function queue(state = initialQueue, action) {
  switch (action.type) {
    case QUEUE_UPDATE:
      return { ...state,
        queue: action.queue,
      };
    default:
      return state;
  }
}
