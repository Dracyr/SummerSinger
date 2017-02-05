import fetch from 'isomorphic-fetch';

export const REQUEST_INBOX = 'REQUEST_INBOX';
export const RECEIVE_INBOX = 'RECEIVE_INBOX';
export const SORT_INBOX = 'SORT_INBOX';
export const ADD_TRACK_TO_LIBRARY = 'ADD_TRACK_TO_LIBRARY';

export const REQUEST_CLEAR_INBOX = 'REQUEST_CLEAR_INBOX';
export const CLEAR_INBOX = 'CLEAR_INBOX';

function requestInbox(offset, limit) {
  return { type: REQUEST_INBOX, offset, limit };
}

function receiveInbox(full = true, total, inbox, offset) {
  return { type: RECEIVE_INBOX, full, total, inbox, offset };
}

export function fetchInbox(offset = 0, limit = 0, inboxSort = null) {
  return (dispatch, getState) => {
    const total = offset + limit;
    const sort = inboxSort || getState().inbox.inboxSort;

    dispatch(requestInbox(offset, limit));

    const full = total === 0;
    let query = full ? '?' :
      `?inbox=true&offset=${offset}&limit=${limit}&`;
    query = sort ? `${query}sort_by=${sort.sortBy}&sort_dir=${sort.dir}` : query;
    return fetch(`/api/tracks${query}`)
      .then(response => response.json())
      .then(json => dispatch(receiveInbox(full, json.total, json.data, offset)));
  };
}

export function sortInbox(sort) {
  return dispatch => {
    dispatch({ type: SORT_INBOX, sort, client: false });
    dispatch(fetchInbox(0, 50, sort));
  };
}

export function addTrackToLibrary(trackId) {
  return dispatch => {
    fetch(`/api/tracks/${trackId}`, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        track: {
          inbox: false,
        },
      }),
    });

    dispatch({ type: ADD_TRACK_TO_LIBRARY, trackId });
  };
}


export function requestClearInbox() {
  return { type: REQUEST_CLEAR_INBOX };
}

export function clearInbox() {
  return { type: CLEAR_INBOX };
}

