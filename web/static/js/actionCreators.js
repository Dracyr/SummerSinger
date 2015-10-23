import * as actions from './actions';
import fetch from 'isomorphic-fetch';
import { getGrooveSocket } from './containers/App';

export function socketStatusUpdate(status) {
  return { type: actions.SOCKET_STATUS_UPDATE, status };
}

export function setPlaying(playing) {
  return { type: actions.SET_PLAYING, playing };
}

export function requestPlaying(playing) {
  getGrooveSocket().play(playing);
  return { type: actions.REQUEST_PLAYING };
}

export function seek(duration) {
  return { type: actions.SEEK, duration};
}

export function setStreaming(streaming) {
  return { type: actions.SET_STREAMING, streaming};
}

export function playTrack(track) {
  return { type: actions.PLAY_TRACK, track};
}

export function previousTrack() {
  return { type: actions.PREVIOUS_TRACK };
}

export function nextTrack() {
  return { type: actions.NEXT_TRACK };
}

export function addTrackToQueue(track) {
  return { type: actions.ADD_TRACK_TO_QUEUE, track};
}

export function setHwPlayback(hwPlayback) {
  return { type: actions.SET_HW_PLAYBACK, hwPlayback};
}

export function setHwVolume(hwVolume) {
  return { type: actions.SET_HW_VOLUME, hwVolume};
}

export function switchView(view) {
  return { type: actions.SWITCH_VIEW, view };
}

export function switchPlaylist(playlist) {
  return { type: actions.SWITCH_PLAYLIST, playlist };
}

export function currentTrack(track) {
  return { type: actions.SOCKET_CURRENT_TRACK, track };
}

export function libraryUpdate(update) {
  return { type: actions.SOCKET_LIBRARY_UPDATE, update };
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
