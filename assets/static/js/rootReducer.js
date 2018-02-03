import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';

import player from './app/Player/reducer';
import library from './app/Library/reducer';
import albums from './app/Album/reducer';
import artists from './app/Artist/reducer';
import inbox from './app/Inbox/reducer';
import folders from './app/Folders/reducer';
import playlist from './app/Playlist/reducer';
import settings from './app/Settings/reducer';

import {
  GO_TO_PARENT,
  GO_TO_PARENT_N,
  RECEIVE_FOLDER,
} from './app/Folders/actions';

const rootReducer = combineReducers({
  player,
  library,
  albums,
  artists,
  inbox,
  playlist,
  sidebar,
  settings,
  folders: undoable(folders, {
    filter: includeAction([RECEIVE_FOLDER]),
    debub: true,
    undoType: GO_TO_PARENT,
    jumpToPastType: GO_TO_PARENT_N,
  }),
});

export default rootReducer;
