import React from 'react';
import {Provider} from 'react-redux';
import Routes from './routes';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';

export default function getRoot(store) {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </div>
  );
}
