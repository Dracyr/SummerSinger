import { combineReducers } from "redux";
import undoable from "redux-undo";

import {
  GO_TO_PARENT,
  GO_TO_PARENT_N,
  RECEIVE_FOLDER
} from "Containers/Folders/actions";
import player from "Containers/Player/reducer";
import folders from "Containers/Folders/reducer";
import settings from "Containers/Settings/reducer";
import playlist from "Containers/Playlists/reducer";
import library from "Containers/Library/reducer";
import albums from "Containers/Albums/reducer";
import artists from "Containers/Artists/reducer";
import inbox from "Containers/Inbox/reducer";
import importer from "Containers/Importer/reducer";

const rootReducer = combineReducers({
  player,
  library,
  albums,
  artists,
  inbox,
  playlist,
  settings,
  importer,
  folders: undoable(folders, {
    filter: action => action.type === RECEIVE_FOLDER,
    undoType: GO_TO_PARENT,
    jumpToPastType: GO_TO_PARENT_N
  })
});

export default rootReducer;
