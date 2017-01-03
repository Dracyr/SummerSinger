import {
  RECEIVE_INBOX,
  SORT_INBOX,
} from './actions';

import { TRACK_UPDATE } from '../Track/actions';

const initialLibrary = {
  inboxSort: { sortBy: 'title', dir: 'asc' },
  tracks: [],
  totalTracks: 0,
};

export default function library(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_INBOX:
      let newState;
      if (action.full) {
        newState = { ...state, tracks: action.inbox, totalTracks: action.total };
      } else {
        // return { ...state,
        //   tracks: action.full ? action.inbox : [...state.tracks, ...action.inbox],
        //   totalTracks: action.total,
        // };
        const tracks = state.tracks;
        for (let i = 0; i < action.inbox.length; i++) {
          tracks[action.offset + i] = action.inbox[i];
        }
        newState = { ...state, tracks, totalTracks: action.total };
      }
      return newState;
    case SORT_INBOX:
      return { ...state, inboxSort: action.sort, tracks: [] };
    case TRACK_UPDATE:
      return { ...state,
        tracks: state.tracks
          .map(track => {
            return action.track.id === track.id ? action.track : track;
          })
          .filter(track => track.inbox),
      };
    default:
      return state;
  }
}
