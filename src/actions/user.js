import fetch from '../mockable-fetch';
import {createAction} from 'redux-actions';
import api from '../api';
import {get} from 'lodash';

export function retrieveUserFromSession() {
  return (dispatch) => {
    dispatch(createAction('fetchUserData')());
    return fetch('/me?' + (+new Date()), {method: 'GET', credentials: 'same-origin'}).then((response) => {
      return response.json();
    }).then((user) => {
      if (user.token) { // If the user is registered, check admin organizations
        const url = "v1/users/" + user.id + "/";
        return api.get({user: {data: user}}, url, {}).then((democracyUser) => {
          return democracyUser.json();
        }).then((democracyUserJSON) => {
          const userWithOrganization = Object.assign({},
            user,
            {nickname: get(democracyUserJSON, 'nickname')},
            {answered_questions: get(democracyUserJSON, 'answered_questions')},
            {adminOrganizations: get(democracyUserJSON, 'admin_organizations', null)});
          return dispatch(createAction('receiveUserData')(userWithOrganization));
        });
      }
      return dispatch(createAction('receiveUserData')(user));
    });
  };
}


export function login() {
  return (dispatch) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {  // Not in DOM? Just try to get an user then and see how that goes.
        resolve(true);
        return;
      }
      const loginPopup = window.open(
        '/login/helsinki',
        'kkLoginWindow',
        'location,scrollbars=on,width=720,height=600'
      );
      const wait = function wait() {
        if (!loginPopup || loginPopup.closed) { // Is our login popup gone (if it opened at all)?
          resolve(true);
          return;
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
      // the store may contain hearings not fit for nonauthorized eyes!
      dispatch(createAction('clearNonPublicHearings')());
      resolve();
    });
  };
}
