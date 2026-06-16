import { combineReducers, createReducer } from '@reduxjs/toolkit';

import { EditorActions } from '../../actions/hearingEditor';

const all = createReducer([], (builder) => {
  builder.addCase(
    EditorActions.RECEIVE_META_DATA,
    (_state, { payload: { organizations } }) =>
      organizations.entities.organizations
        ? Object.values(organizations.entities.organizations)
        : []
  );
});

export default combineReducers({
  all,
});
