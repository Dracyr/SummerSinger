export const REMOVE_QUEUE_TRACK = 'REMOVE_QUEUE_TRACK';

export function removeQueueTrack(trackIndex) {
  return { type: REMOVE_QUEUE_TRACK, trackIndex };
}

export const CLEAR_QUEUE = 'CLEAR_QUEUE';

export function clearQueue() {
  return { type: CLEAR_QUEUE };
}
