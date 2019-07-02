import React from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import App from './App';
import {history} from './createStore';
import ScrollToTop from './scrollToTop';

export default function getRoot(store) {
  return (
    <div>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ScrollToTop>
            <App />
          </ScrollToTop>
        </ConnectedRouter>
      </Provider>
    </div>
  );
}
