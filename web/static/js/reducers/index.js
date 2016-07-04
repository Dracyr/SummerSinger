import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';

import player from '../app/Player/reducer';
import queue from '../app/Queue/reducer';
import library from '../app/Library/reducer';
import folders from '../app/Folders/reducer';
import playlist from '../app/Playlist/reducer';
import sidebar from '../app/Sidebar/reducer';
import views from './views';

import {
  GO_TO_PARENT,
  GO_TO_PARENT_N,
  RECEIVE_FOLDER,
} from '../app/Folders/actions';

const rootReducer = combineReducers({
  player,
  library,
  views,
  playlist,
  sidebar,
  queue,
  folders: undoable(folders, {
    filter: includeAction([RECEIVE_FOLDER]),
    debub: true,
    undoType: GO_TO_PARENT,
    jumpToPastType: GO_TO_PARENT_N,
  }),
});

export default rootReducer;
