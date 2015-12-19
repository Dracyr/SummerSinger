import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';

import GrooveApp from './GrooveApp';
import configureStore from '../store/configureStore';
import GrooveSocket from '../components/GrooveSocket';

const store = configureStore();

const grooveSocket = new GrooveSocket(store);
export function getGrooveSocket() {
  return grooveSocket;
}

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <GrooveApp grooveSocket={grooveSocket} dispatch={store.dispatch} />
            <DevTools />
          </div>
        </Provider>
      </div>
    );
  }
}

