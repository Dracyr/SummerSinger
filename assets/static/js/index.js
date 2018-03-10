import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppContainer } from "react-hot-loader";

import configureStore from "Util/configureStore";
import SummerSocket from "Util/SummerSocket";
import App from "Containers/App";

const summerSocket = new SummerSocket();
const store = configureStore(summerSocket);

const rootEl = document.getElementById("container");

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    rootEl
  );
};

render(App);

if (module.hot) {
  module.hot.accept("Containers/App", () => {
    render(App);
  });
}
