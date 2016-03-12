import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';

import configureStore from './configureStore';
import SummerSocket from './lib/SummerSocket';

const summerSocket = new SummerSocket();
const store = configureStore(summerSocket);

export function getSummerSocket() {
  return summerSocket;
}

render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('container')
);
