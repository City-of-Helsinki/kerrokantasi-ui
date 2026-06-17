import { combineReducers, createReducer } from '@reduxjs/toolkit';
import get from 'lodash/get';
import keys from 'lodash/keys';

import { EditorActions } from '../../actions/hearingEditor';

const CONTACTS = 'contactPersons';

const byId = createReducer({}, (builder) => {
  builder
    .addCase(
      EditorActions.RECEIVE_CONTACT_PERSONS,
      (_state, { payload: { contactPersons } }) =>
        contactPersons.entities.contactPersons
          ? contactPersons.entities.contactPersons
          : {}
    )
    .addCase(
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
      (state, { payload: { entities } }) => ({
        ...state,
        ...get(entities, CONTACTS, {}),
      })
    );
});

const all = createReducer([], (builder) => {
  builder
    .addCase(
      EditorActions.RECEIVE_CONTACT_PERSONS,
      (_state, { payload: { contactPersons } }) =>
        contactPersons.result.map((key) => key.toString())
    )
    .addCase(
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
      (state, { payload: { entities } }) => [
        ...new Set([...state, ...keys(entities[CONTACTS])]),
      ]
    );
});

export default combineReducers({
  byId,
  all,
});
