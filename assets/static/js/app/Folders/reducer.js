import {
  RECEIVE_FOLDER,
  RECEIVE_ROOT_FOLDER,
} from './actions';

export const initialFolders = {
  pathParts: [''],
  folder: {
    title: '/',
    children: [],
    tracks: [],
  },
};

export default function library(state = initialFolders, action) {
  switch (action.type) {
    case RECEIVE_ROOT_FOLDER:
      return { ...state,
        folder: {
          title: '/',
          children: action.folders,
          tracks: [],
        },
      };
    case RECEIVE_FOLDER:
      return { ...state,
        pathParts: [...state.pathParts, action.folder.title],
        folder: action.folder,
      };
    default:
      return state;
  }
}
