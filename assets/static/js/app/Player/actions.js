export const REQUEST_PLAYBACK = 'REQUEST_PLAYBACK';
export const REQUEST_QUEUE_TRACK = 'REQUEST_QUEUE_TRACK';
export const REQUEST_PLAY_TRACK = 'REQUEST_PLAY_TRACK';
export const REQUEST_QUEUE_AND_PLAY_TRACK = 'REQUEST_QUEUE_AND_PLAY_TRACK';
export const REQUEST_PREVIOUS_TRACK = 'REQUEST_PREVIOUS_TRACK';
export const REQUEST_NEXT_TRACK = 'REQUEST_NEXT_TRACK';
export const REQUEST_SEEK = 'REQUEST_SEEK';
export const REQUEST_VOLUME = 'REQUEST_VOLUME';

export const PLAYER_UPDATE = 'PLAYER_UPDATE';

export function socketStatusUpdate(statusUpdate) {
  return { type: PLAYER_UPDATE, statusUpdate };
}

export function fetchStatus() {
  return dispatch => {
    return fetch('/api/status')
      .then(response => response.json())
      .then(json => dispatch(socketStatusUpdate(json)));
  };
}

export function requestPlayback(playback) {
  return { type: REQUEST_PLAYBACK, playback };
}

export function requestQueueTrack(trackId) {
  return { type: REQUEST_QUEUE_TRACK, trackId };
}

export function requestPlayTrack(queueId) {
  return { type: REQUEST_PLAY_TRACK, queueId };
}

export function requestQueueAndPlayTrack(trackId) {
  return { type: REQUEST_QUEUE_AND_PLAY_TRACK, trackId };
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

export function requestVolume(percent) {
  return { type: REQUEST_VOLUME, percent };
}
