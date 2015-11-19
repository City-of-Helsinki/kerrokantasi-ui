import fetch from 'mockable-fetch';
import {createAction} from 'redux-actions';

export function retrieveUserFromSession() {
  return (dispatch) => {
    return fetch('/me', {method: 'GET', credentials: 'same-origin'}).then((response) => {
      return response.json();
    }).then((data) => {
      return dispatch(createAction('receiveUserData')(data));
    });
  };
}

export function login() {
  return (dispatch) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {  // Not in DOM? Just try to get an user then and see how that goes.
        return resolve(true);
      }
      const loginPopup = window.open(
        '/login/helsinki',
        'kkLoginWindow',
        'location,scrollbars=on,width=720,height=600'
      );
      const wait = function wait() {
        if (loginPopup.closed) { // Is our login popup gone?
          return resolve(true);
        }
        setTimeout(wait, 500); // Try again in a bit...
      };
      wait();
    }).then(() => {
      return dispatch(retrieveUserFromSession());
    });
  };
}

export function logout() {
  return (dispatch) => {
    // This returns a promise for symmetry with login; it's actually a synchronous action.
    return new Promise((resolve) => {
      fetch('/logout', {method: 'POST', credentials: 'same-origin'});  // Fire-and-forget
      dispatch(createAction('clearUserData')());
      resolve();
    });
  };
}
