// @flow
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import keys from 'lodash/keys';

import { EditorActions } from '../../actions/hearingEditor';

const CONTACTS = 'contactPersons';

const byId = handleActions(
  {
    [EditorActions.RECEIVE_META_DATA]: (state, { payload: { contactPersons } }) =>
      contactPersons.entities.contactPersons,
    [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, { payload: { entities } }) => ({
      ...state,
      ...get(entities, CONTACTS, {}),
    }),
  },
  {},
);

const all = handleActions(
  {
    [EditorActions.RECEIVE_META_DATA]: (state, { payload: { contactPersons } }) =>
      contactPersons.result.map(key => key.toString()),
    [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, { payload: { entities } }) => [
      ...new Set([...state, ...keys(entities[CONTACTS])]),
    ],
  },
  [],
);

const isFetching = handleActions(
  {
    [EditorActions.FETCH_META_DATA]: () => true,
    [EditorActions.RECEIVE_META_DATA]: () => false,
    [EditorActions.ERROR_META_DATA]: () => false,
  },
  false,
);

export default combineReducers({
  byId,
  all,
  isFetching,
});
