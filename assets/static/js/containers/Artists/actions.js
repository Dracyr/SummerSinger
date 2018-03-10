export const RECEIVE_ARTIST = "RECEIVE_ARTIST";

function receiveArtist(artist) {
  return { type: RECEIVE_ARTIST, artist };
}

export function fetchArtist(artistId) {
  return (dispatch, getState) => {
    const artist = getState().library.artists.find(a => a && a.id === artistId);
    if (artist) {
      return dispatch(receiveArtist(artist));
    }

    return fetch(`/api/artists/${artistId}`)
      .then(response => response.json())
      .then(json => dispatch(receiveArtist(json.data)));
  };
}
