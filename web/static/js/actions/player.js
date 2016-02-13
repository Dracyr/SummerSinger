import { getSummerSocket } from '../index';

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
  getSummerSocket().requestPlayback(playback);
  return { type: REQUEST_PLAYBACK };
}

export function requestQueueTrack(trackId) {
  getSummerSocket().requestQueueTrack(trackId);
  return { type: REQUEST_QUEUE_TRACK };
}

export function requestPlayTrack(queueId) {
  getSummerSocket().requestPlayTrack(queueId);
  return { type: REQUEST_PLAY_TRACK };
}

export function requestPreviousTrack() {
  getSummerSocket().requestPreviousTrack();
  return { type: REQUEST_PREVIOUS_TRACK };
}

export function requestNextTrack() {
  getSummerSocket().requestNextTrack();
  return { type: REQUEST_NEXT_TRACK };
}

export function requestSeek(percent) {
  getSummerSocket().requestSeek(percent);
  return { type: REQUEST_SEEK };
}

export function queueUpdate(queue) {
  return { type: QUEUE_UPDATE, queue };
}
