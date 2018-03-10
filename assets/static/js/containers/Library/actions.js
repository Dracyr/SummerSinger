export const REQUEST_LIBRARY = "REQUEST_LIBRARY";
export const RECEIVE_LIBRARY = "RECEIVE_LIBRARY";

export const REQUEST_SEARCH = "REQUEST_SEARCH";
export const RECEIVE_SEARCH = "RECEIVE_SEARCH";

export const SORT_LIBRARY = "SORT_LIBRARY";

function requestLibrary(libraryType, offset, limit) {
  return { type: REQUEST_LIBRARY, libraryType, offset, limit };
}

function receiveLibrary(libraryType, full = true, total, library, offset) {
  return { type: RECEIVE_LIBRARY, libraryType, full, total, library, offset };
}

export function fetchLibrary(
  libraryType,
  offset = 0,
  limit = 0,
  librarySort = null
) {
  return (dispatch, getState) => {
    const total = offset + limit;

    const sort = librarySort || getState().library.librarySort;

    dispatch(requestLibrary(libraryType, offset, limit));

    const full = total === 0; //  || !librarySort;
    let query = full ? "?" : `?offset=${offset}&limit=${limit}&`;
    query =
      sort && libraryType === "tracks"
        ? `${query}sort_by=${sort.sortBy}&sort_dir=${sort.dir}`
        : query;
    return fetch(`/api/${libraryType}${query}`)
      .then(response => response.json())
      .then(json =>
        dispatch(
          receiveLibrary(libraryType, full, json.total, json.data, offset)
        )
      );
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
    dispatch(fetchLibrary("tracks", 0, 50, sort));
  };
}
