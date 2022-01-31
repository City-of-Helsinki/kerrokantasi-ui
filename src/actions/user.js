import {createAction} from 'redux-actions';
import api from '../api';
import {get} from 'lodash';

export default function retrieveUserFromSession() {
  return (dispatch, getState) => {
    dispatch(createAction('fetchUserData')());
    const state = getState();
    if (!state.oidc.user) {
      return null;
    }
    const url = 'v1/users/' + state.oidc.user.profile.sub;
    return api.get(state, url).then((democracyUser) => {
      return democracyUser.json();
    }).then((democracyUserJSON) => {
      const userWithOrganization = Object.assign({},
        {displayName: get(democracyUserJSON, 'first_name') + ' ' + get(democracyUserJSON, 'last_name')},
        {nickname: get(democracyUserJSON, 'nickname')},
        {answered_questions: get(democracyUserJSON, 'answered_questions')},
        {favorite_hearings: get(democracyUserJSON, 'followed_hearings')},
        {adminOrganizations: get(democracyUserJSON, 'admin_organizations', null)},
        {hasStrongAuth: get(democracyUserJSON, 'has_strong_auth', false)});
      return dispatch(createAction('receiveUserData')(userWithOrganization));
    });
  };
}
