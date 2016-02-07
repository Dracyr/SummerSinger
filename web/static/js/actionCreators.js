import * as actions from './actions';
import fetch from 'isomorphic-fetch';
import { getSummerSocket } from './containers/App';

export function switchView(view) {
  return { type: actions.SWITCH_VIEW, view };
}

export function switchPlaylist(playlist) {
  return { type: actions.SWITCH_PLAYLIST, playlist };
}

export function socketStatusUpdate(statusUpdate) {
  return { type: actions.SOCKET_STATUS_UPDATE, statusUpdate };
}

export function requestPlayback(playback) {
  getSummerSocket().requestPlayback(playback);
  return { type: actions.REQUEST_PLAYBACK };
}

export function requestQueueTrack(trackId) {
  getSummerSocket().requestQueueTrack(trackId);
  return { type: actions.REQUEST_QUEUE_TRACK };
}

export function requestPlayTrack(queueId) {
  getSummerSocket().requestPlayTrack(queueId);
  return { type: actions.REQUEST_PLAY_TRACK };
}

export function requestPreviousTrack() {
  getSummerSocket().requestPreviousTrack();
  return { type: actions.REQUEST_PREVIOUS_TRACK };
}

export function requestNextTrack() {
  getSummerSocket().requestNextTrack();
  return { type: actions.REQUEST_NEXT_TRACK };
}

export function requestSeek(percent) {
  getSummerSocket().requestSeek(percent);
  return { type: actions.REQUEST_SEEK };
}

export function queueUpdate(queue) {
  return { type: actions.QUEUE_UPDATE, queue };
}

function requestLibrary() {
  return { type: actions.REQUEST_LIBRARY };
}

function receiveLibrary(library) {
  return { type: actions.RECEIVE_LIBRARY, library };
}

export function fetchLibrary() {
  return dispatch => {
    dispatch(requestLibrary());

    return fetch('http://localhost:4000/api/tracks')
      .then(response => response.json())
      .then(json => dispatch(receiveLibrary(json.data)));
  };
}
