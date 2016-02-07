import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';

import SummerApp from './SummerApp';
import configureStore from '../store/configureStore';
import SummerSocket from '../components/SummerSocket';

const store = configureStore();

const summerSocket = new SummerSocket(store);
export function getSummerSocket() {
  return summerSocket;
}

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <SummerApp SummerSocket={SummerSocket} dispatch={store.dispatch} />
            <DevTools />
          </div>
        </Provider>
      </div>
    );
  }
}

