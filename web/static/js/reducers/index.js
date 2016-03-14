import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo'

import player from './player';
import library from './library';
import views from './views';
import folders from './folders';

import {
  GO_TO_PARENT,
  GO_TO_PARENT_N,
  RECEIVE_FOLDER,
} from '../actions/folders';

const rootReducer = combineReducers({
  player,
  library,
  views,
  folders: undoable(folders, {
    filter: includeAction([RECEIVE_FOLDER]),
    debub: true,
    undoType: GO_TO_PARENT,
    jumpToPastType: GO_TO_PARENT_N,
  })
});

export default rootReducer;
