import React, { Component } from 'react';
import GrooveApp from './GrooveApp';

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from '../reducers';

import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import GrooveSocket from '../components/GrooveSocket';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  createStore
);

const reducer = combineReducers(reducers);
const store = finalCreateStore(reducer);

let grooveSocket = new GrooveSocket(store);
export function getGrooveSocket() {
  return grooveSocket;
}

export default class App extends Component {

  render() {
    return (
      <div>
        <Provider store={store}>
          {() => <GrooveApp grooveSocket={grooveSocket} dispatch={store.dispatch} />}
        </Provider>
        <DebugPanel top right bottom>
           <DevTools store={store}
                     monitor={LogMonitor} />
         </DebugPanel>
      </div>
    );
  }
}

