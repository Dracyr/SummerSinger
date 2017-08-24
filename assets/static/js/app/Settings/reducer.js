import {
  RECEIVE_CD,
  RECEIVE_LIBRARIES,
} from './actions';

const initialLibrary = {
  import_library_dir: {
    path: '',
    children: [],
  },
  libraryIds: [],
  libraryById: {},
};

export default function settings(state = initialLibrary, action) {
  switch (action.type) {
    case RECEIVE_CD:
      return { ...state, import_library_dir: action.dir };
    case RECEIVE_LIBRARIES:
      return { ...state,
        libraryIds: action.libraries.map(l => l.id),
        libraryById: action.libraries.reduce((acc, l) => {
          const a = {};
          a[l.id] = l;
          return Object.assign(acc, a);
        }, {}) };
    default:
      return state;
  }
}
