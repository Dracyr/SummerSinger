export const QUEUE_UPDATE = 'QUEUE_UPDATE';

export function queueUpdate(queue) {
  return { type: QUEUE_UPDATE, queue };
}

export const REMOVE_QUEUE_TRACK = 'REMOVE_QUEUE_TRACK';

export function removeQueueTrack(trackIndex) {
  return { type: REMOVE_QUEUE_TRACK, trackIndex };
}

export const CLEAR_QUEUE = 'CLEAR_QUEUE';

export function clearQueue() {
  return { type: CLEAR_QUEUE };
}

export function fetchQueue() {
  return dispatch => (
    fetch('/api/queue')
      .then(response => response.json())
      .then(json => dispatch(queueUpdate(json.queue)))
  );
}
