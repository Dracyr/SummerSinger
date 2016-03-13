export const REQUEST_PLAYBACK = 'REQUEST_PLAYBACK';
export const REQUEST_QUEUE_TRACK = 'REQUEST_QUEUE_TRACK';
export const REQUEST_PLAY_TRACK = 'REQUEST_PLAY_TRACK';
export const REQUEST_PREVIOUS_TRACK = 'REQUEST_PREVIOUS_TRACK';
export const REQUEST_NEXT_TRACK = 'REQUEST_NEXT_TRACK';
export const REQUEST_SEEK = 'REQUEST_SEEK';

export const SOCKET_STATUS_UPDATE = 'SOCKET_STATUS_UPDATE';
export const QUEUE_UPDATE = 'QUEUE_UPDATE';

export function socketStatusUpdate(statusUpdate) {
  return { type: SOCKET_STATUS_UPDATE, statusUpdate };
}

export function requestPlayback(playback) {
  return { type: REQUEST_PLAYBACK, playback };
}

export function requestQueueTrack(trackId, play = false) {
  return { type: REQUEST_QUEUE_TRACK, trackId, play };
}

export function requestPlayTrack(queueId) {
  return { type: REQUEST_PLAY_TRACK, queueId };
}

export function requestPreviousTrack() {
  return { type: REQUEST_PREVIOUS_TRACK };
}

export function requestNextTrack() {
  return { type: REQUEST_NEXT_TRACK };
}

export function requestSeek(percent) {
  return { type: REQUEST_SEEK, percent };
}

export function queueUpdate(queue) {
  return { type: QUEUE_UPDATE, queue };
}
