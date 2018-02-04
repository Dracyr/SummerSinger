import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../rootReducer';
import socketMiddleware from './socketMiddleware';

export default function configureStore(socket, initialState) {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(socketMiddleware(socket)),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  )(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  socket.initialize(store);

  // Hot reload reducers
  if (module.hot) {
    module.hot.accept('../rootReducer', () => {
      store.replaceReducer(require('../rootReducer'));
    });
  }

  return store;
}
