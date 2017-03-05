import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import socketMiddleware from './socketMiddleware';

import thunk from 'redux-thunk';

export default function configureStore(socket, initialState) {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(socketMiddleware(socket)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  socket.initialize(store);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
