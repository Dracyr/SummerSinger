import fetch from 'isomorphic-fetch';

export const SWITCH_LIBRARY_VIEW = 'SWITCH_LIBRARY_VIEW';

export const REQUEST_LIBRARY = 'REQUEST_LIBRARY';
export const RECEIVE_LIBRARY = 'RECEIVE_LIBRARY';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';

export const LibraryViews = {
  TRACKS: 'TRACKS',
  ARTISTS: 'ARTISTS',
  ALBUMS: 'ALBUMS',
  FOLDERS: 'FOLDERS',
};

export function switchLibraryView(libraryView) {
  return { type: SWITCH_LIBRARY_VIEW, libraryView };
}

function requestLibrary(libraryType, offset) {
  return { type: REQUEST_LIBRARY, libraryType, offset };
}

function receiveLibrary(libraryType, full = true, total, library) {
  return { type: RECEIVE_LIBRARY, libraryType, full, total, library };
}

export function fetchLibrary(libraryType, offset = 0, limit = 0) {
  return (dispatch, getState) => {
    const total = offset + limit;
    if (getState().library[libraryType].length >= total) {
      return null;
    }

    dispatch(requestLibrary(libraryType, total));

    const full = total === 0;
    const query = full ? '' : `?offset=${offset}&limit=${limit}`;
    return fetch(`/api/${libraryType}${query}`)
      .then(response => response.json())
      .then(json => dispatch(receiveLibrary(libraryType, full, json.total, json.data)));
  };
}

function requestSearch(search_term) {
  return { type: REQUEST_SEARCH, search_term };
}

function receiveSearch(search) {
  return { type: RECEIVE_SEARCH, search };
}

export function fetchSearch(search_term) {
  return (dispatch, getState) => {

    dispatch(requestSearch(search_term));

    return fetch('/api/tracks?search=' + search_term)
      .then(response => response.json())
      .then(json => dispatch(receiveSearch(json.data)));
  };
}
