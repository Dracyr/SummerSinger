import { RECEIVE_INBOX, SORT_INBOX, CLEAR_INBOX } from "./actions";

import { TRACK_UPDATE } from "Containers/Tracks/actions";
import { insertAtOffset } from "Util";

const initialLibrary = {
  inboxSort: { sortBy: "title", dir: "asc" },
  tracks: [],
  totalTracks: 0
};

export default function library(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_INBOX:
      if (action.full) {
        return { ...state, tracks: action.inbox, totalTracks: action.total };
      }

      return {
        ...state,
        tracks: insertAtOffset(state.tracks, action.inbox, action.offset),
        totalTracks: action.total
      };
    case SORT_INBOX:
      return { ...state, inboxSort: action.sort, tracks: [] };
    case TRACK_UPDATE:
      return {
        ...state,
        tracks: state.tracks
          .map(track => {
            return action.track.id === track.id ? action.track : track;
          })
          .filter(track => track.inbox)
      };
    case CLEAR_INBOX:
      return {
        ...state,
        tracks: [],
        totalTracks: 0
      };
    default:
      return state;
  }
}
