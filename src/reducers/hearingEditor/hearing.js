// @flow
import { combineReducers } from 'redux';
import { combineActions, handleActions } from 'redux-actions';
import { head, findIndex } from 'lodash';
import { moveSubsectionInArray } from '../../utils/hearingEditor';
import updeep from 'updeep';

import { EditorActions } from '../../actions/hearingEditor';

// const getNormalizedHearing = (rawHearing) => {
//   const normalizedHearing = normalize(rawHearing, hearingSchema);
//   return normalizedHearing.entities.hearing[rawHearing.id];
// };

const sectionMoveUp = (sections, sectionId) => {
  const sectionIndex = findIndex(sections, (el) => el === sectionId);
  const sortedSubsections = moveSubsectionInArray(sections, sectionIndex, -1);
  return sortedSubsections;
};

const sectionMoveDown = (sections, sectionId) => {
  const sectionIndex = findIndex(sections, (el) => el === sectionId);
  const sortedSubsections = moveSubsectionInArray(sections, sectionIndex, 1);
  return sortedSubsections;
};

const data = handleActions(
  {
    [EditorActions.RECEIVE_HEARING]: (state, { payload: { result, entities } }) => entities.hearing[result],
    [EditorActions.BEGIN_EDIT_HEARING]: (state, { payload }) => payload.hearing,
    // Weird way of getting the normalized hearing when the hearing actually was normalized without any identifier
    [EditorActions.INIT_NEW_HEARING]: (state, { payload: { entities } }) =>
      entities.hearing[head(Object.keys(entities.hearing))],
    [EditorActions.EDIT_HEARING]: (state, { payload: { field, value } }) => {
      return Object.assign({}, state, { [field]: value });
    },
    [EditorActions.ADD_SECTION]: (state, { payload: { section } }) => ({
      ...state,
      sections: [...state.sections, section.frontId],
    }),
    [EditorActions.REMOVE_SECTION]: (state, { payload: { sectionID } }) => ({
      ...state,
      sections: state.sections.filter(id => id !== sectionID),
    }),
    [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, { payload: { result, entities } }) => ({
      ...state,
      ...entities.hearing[result],
    }),
    [EditorActions.ADD_LABEL_SUCCESS]: (state, { payload: { label } }) => updeep({labels: [...state.labels.push(label.id)]}, state),
    [EditorActions.SECTION_MOVE_UP]: (state, { payload: sectionId }) => updeep({sections: sectionMoveUp(state.sections, sectionId)}, state),
    [EditorActions.SECTION_MOVE_DOWN]: (state, { payload: sectionId }) => updeep({sections: sectionMoveDown(state.sections, sectionId)}, state)
  },
  null,
);

const isFetching = handleActions(
  {
    [combineActions('beginFetchHearing')]: () => true,
    [combineActions('receiveHearing')]: () => false,
    [combineActions('receiveHearingError')]: () => false
  },
  false,
);

const reducer = combineReducers({
  data,
  isFetching,
});


export default reducer;
