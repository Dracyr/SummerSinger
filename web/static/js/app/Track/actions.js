import fetch from 'isomorphic-fetch';

export const UPDATE_TRACK = 'UPDATE_TRACK';
export const TRACK_UPDATE = 'TRACK_UPDATE';

export function trackUpdate(trackId, track) {
  return { type: TRACK_UPDATE, trackId, track };
}

export function updateTrack(trackId, params) {
  return dispatch => {
    fetch(`/api/tracks/${trackId}`, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ track: params }),
    })
    .then(response => response.json())
    .then(json => {
      const track = json.data;
      dispatch(trackUpdate(track.id, track));
    });
  };
}
