import {
  SWITCH_VIEW,
  SWITCH_PLAYLIST,
} from '../actions/views';

const initialState = {
  view: 'QUEUE',
  viewContext: null,
  playlist: null,
};

export function viewContext(state, action) {
  if (action.type === SWITCH_VIEW) {
    /*
      When we are moving from one view to another, save the old viewContext
      if it exists, and move the saved viewContext into view reducer.
    */
    const currentView = state.views.view.toLowerCase(); // The view we are leaving
    const nextView = action.view.toLowerCase();

    const currentViewState = {};

    if (state.views.viewContext) {
      currentViewState[currentView] = {
        ...state[currentView],
        viewContext: state.views.viewContext,
      };
    }

    const nextViewContext = state[nextView] && state[nextView].viewContext
      ? state[nextView].viewContext : null;
    return Object.assign(state, currentViewState, {
      views: {
        ...state.views,
        view: action.view,
        viewContext: nextViewContext,
      },
    });
  }

  return state;
}

export default function views(state = initialState, action) {
  switch (action.type) {
    case SWITCH_PLAYLIST:
      return { ...state, view: 'PLAYLIST', playlist: action.playlist };
    default:
      return state;
  }
}
