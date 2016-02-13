import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';

import configureStore from './configureStore';
import SummerSocket from './lib/SummerSocket';

const store = configureStore();

const summerSocket = new SummerSocket(store);
export function getSummerSocket() {
  return summerSocket;
}

render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('container')
);
