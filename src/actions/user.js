import fetch from 'isomorphic-fetch';
import {createAction} from 'redux-actions';

export function retrieveUserFromSession() {
  return (dispatch) => {
    fetch('/me', {method: 'GET', credentials: 'same-origin'}).then((response) => {
      response.json().then((data) => {
        dispatch(createAction('receiveUserData')(data));
      });
    });
  };
}

export function login() {
  return (dispatch) => {
    const loginPopup = window.open(
      '/login/helsinki',
      'kkLoginWindow',
      'location,scrollbars=on,width=720,height=600'
    );
    const wait = function wait() {
      if (loginPopup.closed) { // Is our login popup gone?
        dispatch(retrieveUserFromSession());
        return;
      }
      setTimeout(wait, 500); // Try again in a bit...
    };
    wait();
  };
}

export function logout() {
  return (dispatch) => {
    fetch('/logout', {method: 'POST', credentials: 'same-origin'});  // Fire-and-forget
    dispatch(createAction('clearUserData')());
  };
}
