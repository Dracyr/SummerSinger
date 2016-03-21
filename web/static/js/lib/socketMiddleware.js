import {
  REQUEST_PLAYBACK,
  REQUEST_QUEUE_TRACK,
  REQUEST_PLAY_TRACK,
  REQUEST_PREVIOUS_TRACK,
  REQUEST_NEXT_TRACK,
  REQUEST_SEEK,
} from '../actions/player';

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
    case REQUEST_PREVIOUS_TRACK:
      socket.requestPreviousTrack();
      break;
    case REQUEST_NEXT_TRACK:
      socket.requestNextTrack();
      break;
    case REQUEST_SEEK:
      socket.requestSeek(action.percent);
      break;
    default:
      break;
  }
  return next(action);
};
