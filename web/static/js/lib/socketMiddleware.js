import {
  REQUEST_PLAYBACK,
  REQUEST_QUEUE_TRACK,
  REQUEST_PLAY_TRACK,
  REQUEST_QUEUE_AND_PLAY_TRACK,
  REQUEST_PREVIOUS_TRACK,
  REQUEST_NEXT_TRACK,
  REQUEST_SEEK,
} from '../app/Player/actions';

import {
  PLAY_FOLDER,
  QUEUE_FOLDER,
} from '../app/Folders/actions';

import {
  ADD_TRACK_TO_PLAYLIST,
  PLAY_PLAYLIST,
  QUEUE_PLAYLIST,
} from '../app/Playlist/actions';

import {
  REMOVE_QUEUE_TRACK,
} from '../app/Queue/actions';

export default socket => store => next => action => {
  switch (action.type) {
    case REQUEST_PLAYBACK:
      socket.requestPlayback(action.playback);
      break;
    case REQUEST_QUEUE_TRACK:
      socket.requestQueueTrack(action.trackId);
      break;
    case REQUEST_PLAY_TRACK:
      socket.requestPlayTrack(action.queueId);
      break;
    case REQUEST_QUEUE_AND_PLAY_TRACK:
      socket.requestQueueAndPlayTrack(action.trackId);
      break;
    case REQUEST_PREVIOUS_TRACK:
      socket.requestPreviousTrack();
      break;
    case REQUEST_NEXT_TRACK:
      socket.requestNextTrack();
      break;
    case REQUEST_SEEK:
      socket.requestSeek(action.percent);
      break;
    case REMOVE_QUEUE_TRACK:
      socket.removeQueueTrack(action.trackIndex);
      break;
    case ADD_TRACK_TO_PLAYLIST:
      socket.addTrackToPlaylist(action.trackId, action.playlistId);
      break;
    case PLAY_FOLDER:
    case QUEUE_FOLDER:
      socket.queueFolder(action.folderId);
      break;
    case PLAY_PLAYLIST:
    case QUEUE_PLAYLIST:
      socket.queuePlaylist(action.playlistId);
      break;
    default:
      break;
  }
  return next(action);
};
