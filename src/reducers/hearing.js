import { createReducer } from '@reduxjs/toolkit';
import { omit } from 'lodash';

import { EditorActions } from '../actions/hearingEditor';

const beginFetchHearing = (state, { payload }) => {
  if (state[payload.hearingSlug]) {
    // If we already have this hearing, we're only probably refreshing it,
    // so preserve the current state if we can...
    return state;
  }
  return { ...state, [payload.hearingSlug]: { state: 'pending' } };
};

const receiveHearing = (state, { payload }) => ({
  ...state,
  [payload.hearingSlug]: { state: 'done', data: payload.data },
});

const deletingHearingDraft = (state, { payload }) => ({
  ...state,
  [payload.hearingSlug]: { state: 'pending' },
});

const deletedHearingDraft = (state, { payload }) =>
  omit(state, [payload.hearingSlug]);

const receiveHearingError = (state, { payload }) => ({
  ...state,
  [payload.hearingSlug]: { state: 'error' },
});

const savedHearing = (state, { payload: { hearing } }) => ({
  ...state,
  [hearing.slug]: { state: 'done', data: hearing },
});

const clearNonPublicHearings = (state) =>
  Object.fromEntries(
    Object.entries(state).map(([slug, hearing]) => [
      slug,
      hearing.data && !hearing.data.published ? { state: 'pending' } : hearing,
    ])
  );

// NOTE: In the original handleActions map, 'savedNewHearing' and 'savedHearingChange'
// had duplicate keys where the EditorActions computed keys won. The deduplication is
// intentional: savedNewHearing -> savedHearing, savedHearingChange -> savedHearing.
export default createReducer({}, (builder) => {
  builder
    .addCase('beginFetchHearing', beginFetchHearing)
    .addCase('receiveHearing', receiveHearing)
    .addCase('receiveHearingError', receiveHearingError)
    .addCase('clearNonPublicHearings', clearNonPublicHearings)
    .addCase(EditorActions.POST_HEARING_SUCCESS, savedHearing)
    .addCase(EditorActions.SAVE_HEARING_SUCCESS, savedHearing)
    .addCase('deletingHearingDraft', deletingHearingDraft)
    .addCase('deletedHearingDraft', deletedHearingDraft);
});
