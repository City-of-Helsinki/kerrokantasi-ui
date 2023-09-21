import React from 'react';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import App from './App';
import {history} from './createStore';
import ScrollToTop from './scrollToTop';
import { OidcProvider } from "redux-oidc";
import userManager from "./utils/userManager";
import { isIE } from 'react-device-detect';
import BrowserWarning from "./views/BrowserWarning";

export default function getRoot(store) {
  return (
    isIE ? <BrowserWarning /> :
    <div>
      <Provider store={store}>
        <OidcProvider store={store} userManager={userManager}>
          <ConnectedRouter history={history}>
            <ScrollToTop>
              <App />
            </ScrollToTop>
          </ConnectedRouter>
        </OidcProvider>
      </Provider>
    </div>
  );
}
