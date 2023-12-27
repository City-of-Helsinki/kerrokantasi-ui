import { createAction } from 'redux-actions';
import { get } from 'lodash';

import { get as apiGet } from '../api';

export default function enrichUserData() {
  return (dispatch, getState) => {
    dispatch(createAction('fetchUserData')());
    const state = getState();
    const url = `v1/users/${state.oidc.user.profile.sub}`;
    return apiGet(state, url).then((democracyUser) => democracyUser.json()).then((democracyUserJSON) => {
      const userWithOrganization = {
        displayName: `${get(democracyUserJSON, 'first_name')} ${get(democracyUserJSON, 'last_name')}`,
        nickname: get(democracyUserJSON, 'nickname'),
        answered_questions: get(democracyUserJSON, 'answered_questions'),
        favorite_hearings: get(democracyUserJSON, 'followed_hearings'),
        adminOrganizations: get(democracyUserJSON, 'admin_organizations', []),
        hasStrongAuth: get(democracyUserJSON, 'has_strong_auth', false)
      };
      return dispatch(createAction('receiveUserData')(userWithOrganization));
    });
  };
}
