import fetch from 'isomorphic-fetch';

export const RECEIVE_CD = 'RECEIVE_CD';

export const RECEIVE_LIBRARIES = 'RECEIVE_LIBRARIES';
export const ADD_LIBRARY = 'ADD_LIBRARY';

function receiveCd(dir) {
  return { type: RECEIVE_CD, dir };
}

export function cd(path) {
  return (dispatch) => {
    console.log();
    return fetch(`/api/file_system/${encodeURIComponent(path)}`)
      .then(response => response.json())
      .then(json => dispatch(receiveCd(json)));
  };
}

function receiveLibraries(libraries) {
  return { type: RECEIVE_LIBRARIES, libraries };
}

export function fetchLibraries() {
  return (dispatch) => {
    return fetch('/api/libraries')
      .then(response => response.json())
      .then(json => dispatch(receiveLibraries(json.data)));
  };
}

export function addLibrary(libraryPath) {
  return (dispatch) => {
    return fetch('/api/libraries', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        library: {
          path: libraryPath,
          title: libraryPath.substring(libraryPath.lastIndexOf('/') + 1),
        },
      }),
    }).then(response => response.json())
      .then(() => dispatch({ type: ADD_LIBRARY, libraryPath }));
  };
}
