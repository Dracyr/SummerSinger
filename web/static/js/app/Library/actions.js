import fetch from 'isomorphic-fetch';

export const SWITCH_LIBRARY_VIEW = 'SWITCH_LIBRARY_VIEW';

export const REQUEST_LIBRARY = 'REQUEST_LIBRARY';
export const RECEIVE_LIBRARY = 'RECEIVE_LIBRARY';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';

export const SORT_LIBRARY = 'SORT_LIBRARY';

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

export function fetchLibrary(libraryType, offset = 0, limit = 0, librarySort = null) {
  return (dispatch, getState) => {
    const total = offset + limit;
    if (!librarySort && getState().library[libraryType].length >= total) {
      return null;
    }
    const sort = librarySort || getState().library.librarySort;

    dispatch(requestLibrary(libraryType, total));

    const full = total === 0; //  || !librarySort;
    let query = full ? '?' : `?offset=${offset}&limit=${limit}&`;
    query = sort ? `${query}sort_by=${sort.sortBy}&sort_dir=${sort.dir}` : query;
    return fetch(`/api/${libraryType}${query}`)
      .then(response => response.json())
      .then(json => dispatch(receiveLibrary(libraryType, full, json.total, json.data)));
  };
}

function requestSearch(searchTerm) {
  return { type: REQUEST_SEARCH, searchTerm };
}

function receiveSearch(search) {
  return { type: RECEIVE_SEARCH, search };
}

export function fetchSearch(searchTerm) {
  return dispatch => {
    dispatch(requestSearch(searchTerm));

    return fetch(`/api/tracks?search=${searchTerm}`)
      .then(response => response.json())
      .then(json => dispatch(receiveSearch(json.data)));
  };
}

export function sortLibrary(sort) {
  return dispatch => {
    dispatch({ type: SORT_LIBRARY, sort, client: false });
    dispatch(fetchLibrary('tracks', 0, 50, sort));
  };
}
