import * as actions from './actions';
import fetch from 'isomorphic-fetch';
import { getGrooveSocket } from './containers/App';

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
  getGrooveSocket().requestPlayback(playback);
  return { type: actions.REQUEST_PLAYBACK };
}

export function requestQueueTrack(trackId) {
  getGrooveSocket().requestQueueTrack(trackId);
  return { type: actions.REQUEST_QUEUE_TRACK };
}

export function requestPlayTrack(queueId) {
  getGrooveSocket().requestPlayTrack(queueId);
  return { type: actions.REQUEST_PLAY_TRACK };
}

export function requestPreviousTrack() {
  getGrooveSocket().requestPreviousTrack();
  return { type: actions.REQUEST_PREVIOUS_TRACK };
}

export function requestNextTrack() {
  getGrooveSocket().requestNextTrack();
  return { type: actions.REQUEST_NEXT_TRACK };
}

export function requestSeek(percent) {
  getGrooveSocket().requestSeek(percent);
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
