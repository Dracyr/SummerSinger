import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import App from './app/App';
import configureStore from './configureStore';
import SummerSocket from './app/Util/SummerSocket';

const summerSocket = new SummerSocket();
const store = configureStore(summerSocket);

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component store={store} />
      </Provider>
    </AppContainer>,
    document.getElementById('container')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app/App', () => { render(App); });
}