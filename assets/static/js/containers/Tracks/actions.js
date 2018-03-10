export const UPDATE_TRACK = "UPDATE_TRACK";
export const TRACK_UPDATE = "TRACK_UPDATE";

export function trackUpdate(track) {
  return { type: TRACK_UPDATE, track };
}

export function updateTrack(trackId, params) {
  return dispatch => {
    fetch(`/api/tracks/${trackId}`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ track: params })
    })
      .then(response => response.json())
      .then(json => dispatch(trackUpdate(json.data)));
  };
}
