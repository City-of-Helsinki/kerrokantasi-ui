import { createAction } from 'redux-actions';
import { get } from 'lodash';

import { get as apiGet } from '../api';

/*
 * This function is called for both logged in and
 * not logged in users and it cannot cause errors
 * because of that
*/
export default function enrichUserData() {
  return (dispatch, getState) => {
    dispatch(createAction('fetchUserData')());
    const state = getState();
    if (!state.oidc.user) {
      return null;
    }
    const url = `v1/users/${state.oidc.user.profile.sub}`;

    return apiGet(state, url).then(
      (response) => {
        if(response.status >= 400) {
          dispatch(createAction('clearUserData')());
          throw new Error(`Api responded with error: ${  response.body}`)
        }
        response.json().then((democracyUser) => {
          const userWithOrganization = {
            displayName: `${get(democracyUser, 'first_name')} ${get(democracyUser, 'last_name')}`,
            nickname: get(democracyUser, 'nickname'),
            answered_questions: get(democracyUser, 'answered_questions'),
            favorite_hearings: get(democracyUser, 'followed_hearings'),
            adminOrganizations: get(democracyUser, 'admin_organizations', []),
            hasStrongAuth: get(democracyUser, 'has_strong_auth', false)
          };
          return dispatch(createAction('receiveUserData')(userWithOrganization));
        })
      },
    );
  };
}
