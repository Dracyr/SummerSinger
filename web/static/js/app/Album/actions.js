import fetch from 'isomorphic-fetch';

export const RECEIVE_ALBUM = 'RECEIVE_ALBUM';

function receiveAlbum(album) {
  return { type: RECEIVE_ALBUM, album };
}

export function fetchAlbum(albumId) {
  return (dispatch, getState) => {
    const album = getState().library.albums.find(a => a && a.id === albumId);
    if (album) {
      return dispatch(receiveAlbum(album));
    }

    return fetch(`/api/albums/${albumId}`)
      .then(response => response.json())
      .then(json => dispatch(receiveAlbum(json.data)));
  };
}
