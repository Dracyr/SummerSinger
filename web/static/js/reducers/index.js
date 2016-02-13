import { combineReducers } from 'redux';
import player from './player';
import library from './library';
import views from './views';

const rootReducer = combineReducers({
  player,
  library,
  views
});

export default rootReducer;
