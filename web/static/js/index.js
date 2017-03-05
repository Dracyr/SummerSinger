import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/App';

import configureStore from './configureStore';
import SummerSocket from './app/Util/SummerSocket';

const summerSocket = new SummerSocket();
const store = configureStore(summerSocket);

render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('container'),
);
